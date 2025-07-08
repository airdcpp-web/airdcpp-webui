import { useState } from 'react';
import * as React from 'react';

import { useNavigate, useLocation, Location } from 'react-router';

import * as UI from '@/types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from '@/utils/TranslationUtils';

import NotificationActions from '@/actions/NotificationActions';
import { ActionData, ActionDialog, suffixActionI18nKey } from './components/ActionDialog';
import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/context/StoreContext';
import { ModalCloseContext, useModalCloseContext } from '@/context/ModalCloseContext';

interface ActionHandlerDecoratorProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  children: (
    props: ActionHandlerDecoratorChildProps<ItemDataT, EntityT>,
  ) => React.ReactNode;
}

export type ActionClickHandler<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType = void,
> = (action: ActionData<ItemDataT, EntityT>) => void;

export interface ActionHandlerDecoratorChildProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  onClickAction: ActionClickHandler<ItemDataT, EntityT>;
  location: Location;
}

interface HandleAction<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> extends UI.ActionHandlerProps {
  actionData: ActionData<ItemDataT, EntityT>;
  confirmData: boolean | string | undefined;
  closeModal: ModalCloseContext | undefined;
}

const handleAction = async <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>({
  actionData,
  confirmData,
  t,
  closeModal,
  ...actionHandlerProps
}: HandleAction<ItemDataT, EntityT>) => {
  const { action, itemData, entity } = actionData;

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const handlerData: UI.ActionHandlerData<ItemDataT, EntityT> = {
        itemData: itemData,
        entity,
        t,
        ...actionHandlerProps,
      };

      try {
        const result = await action.handler(handlerData, confirmData);
        if (action.notifications?.onSuccess) {
          const item = action.notifications.itemConverter
            ? action.notifications.itemConverter(itemData)
            : itemData;

          const message = t(
            suffixActionI18nKey('Success', actionData, UI.SubNamespaces.NOTIFICATIONS),
            {
              defaultValue: action.notifications.onSuccess,
              replace: {
                item,
                result,
              },
            },
          );

          NotificationActions.success({
            title: translate('Action succeed', t, UI.Modules.COMMON),
            message,
          });
        }

        resolve(result);
      } catch (e) {
        let reason;
        if (typeof e === 'string') {
          reason = e;
        } else if (e) {
          reason = e.message;
        }

        NotificationActions.error({
          title: translate('Action failed', t, UI.Modules.COMMON),
          message: reason,
        });

        reject(Error(reason));
      }
    });
  });
};

type Props<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> = ActionHandlerDecoratorProps<ItemDataT, EntityT>;

const ActionHandlerDecorator = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType = void,
>(
  props: Props<ItemDataT, EntityT>,
) => {
  const socket = useSocket();
  const [confirmActionData, setConfirmActionData] = useState<ActionData<
    ItemDataT,
    EntityT
  > | null>(null);
  const { t } = useTranslation();
  const closeModal = useModalCloseContext();
  const location = useLocation();
  const navigate = useNavigate();
  const store = useAppStore();

  const commonActionHandlerData = {
    location,
    navigate,
    t,
    closeModal,
    socket,
    store,
  };

  const closeConfirmation = () => {
    setTimeout(() => setConfirmActionData(null));
  };

  const handleApproveActionDialog = async (confirmData: boolean | string) => {
    if (!confirmActionData) {
      return;
    }

    await handleAction({
      actionData: confirmActionData,
      confirmData,
      ...commonActionHandlerData,
    });
    closeConfirmation();
  };

  const handleClickAction: ActionClickHandler<ItemDataT, EntityT> = (actionData) => {
    if (actionData.action.confirmation) {
      setConfirmActionData(actionData);
    } else if (actionData.action.input) {
      setConfirmActionData(actionData);
    } else {
      handleAction({
        actionData,
        confirmData: undefined,
        ...commonActionHandlerData,
      });
    }
  };

  const { children, ...other } = props;
  return (
    <>
      {children({
        onClickAction: handleClickAction,
        location,
        ...other,
      })}
      <ActionDialog
        onApproved={handleApproveActionDialog}
        onRejected={closeConfirmation}
        actionData={confirmActionData}
      />
    </>
  );
};

export { ActionHandlerDecorator };
