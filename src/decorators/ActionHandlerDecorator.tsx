import { useState, useContext } from 'react';
import * as React from 'react';

import { useNavigate, useLocation, Location, NavigateFunction } from 'react-router-dom';

import * as UI from 'types/ui';

import {
  ModalCloseContext,
  ModalRouteCloseContext,
} from 'decorators/ModalRouteDecorator';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import NotificationActions from 'actions/NotificationActions';
import { ActionData, ActionDialog, suffixActionI18nKey } from './components/ActionDialog';

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

const isSidebarAction = (actionId: string) =>
  actionId === 'browse' || actionId === 'message';

interface HandleAction<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  actionData: ActionData<ItemDataT, EntityT>;
  confirmData: boolean | string | undefined;
  location: Location;
  navigate: NavigateFunction;
  t: UI.TranslateF;
  closeModal: ModalCloseContext | undefined;
}

const handleAction = async <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>({
  actionData,
  confirmData,
  location,
  t,
  navigate,
  closeModal,
}: HandleAction<ItemDataT, EntityT>) => {
  const { action, itemData, entity } = actionData;
  if (!!closeModal && isSidebarAction(action.id)) {
    closeModal();
  }

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const handlerData: UI.ActionHandlerData<ItemDataT, EntityT> = {
        itemData: itemData,
        entity,
        location,
        navigate,
        t,
      };

      try {
        const result = await action.handler(handlerData, confirmData);
        if (action.notifications && action.notifications.onSuccess) {
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
        const reason = !e ? undefined : typeof e === 'string' ? e : e.message;
        NotificationActions.error({
          title: translate('Action failed', t, UI.Modules.COMMON),
          message: reason,
        });

        reject(reason);
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
  const [confirmActionData, setConfirmActionData] = useState<ActionData<
    ItemDataT,
    EntityT
  > | null>(null);
  const { t } = useTranslation();
  const closeModal = useContext(ModalRouteCloseContext);
  const location = useLocation();
  const navigate = useNavigate();

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
      location,
      navigate,
      t,
      closeModal,
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
        location,
        navigate,
        t,
        closeModal,
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
