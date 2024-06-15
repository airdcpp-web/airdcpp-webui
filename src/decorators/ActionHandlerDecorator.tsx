import { useState, useContext } from 'react';
import * as React from 'react';

import { useNavigate, useLocation, Location, NavigateFunction } from 'react-router-dom';

import * as UI from 'types/ui';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';
import {
  ModalCloseContext,
  ModalRouteCloseContext,
} from 'decorators/ModalRouteDecorator';
import { InputDialog } from 'components/semantic/InputDialog';
import { useTranslation } from 'react-i18next';
import { translate, toI18nKey, toArray } from 'utils/TranslationUtils';

import { upperFirst } from 'lodash';
import { toActionI18nKey } from 'utils/ActionUtils';
import NotificationActions from 'actions/NotificationActions';

interface ActionHandlerDecoratorProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  children: (
    props: ActionHandlerDecoratorChildProps<ItemDataT, EntityT>,
  ) => React.ReactNode;
}

export interface ActionData<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  action: UI.ActionDefinition<ItemDataT, EntityT>;
  itemData: ItemDataT;
  entity: EntityT;
  moduleData: UI.ActionModuleData;
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

const toFieldI18nKey = (
  fieldName: string,
  actionData: ActionData<any, any>,
  subNameSpace: UI.SubNamespaces,
) => {
  const { moduleId, subId } = actionData.moduleData;

  let keyName = actionData.action.id;
  if (subId) {
    keyName += upperFirst(subId);
  }

  keyName += upperFirst(fieldName);

  return toI18nKey(keyName, [
    ...toArray(moduleId),
    UI.SubNamespaces.ACTIONS,
    subNameSpace,
  ]);
};

const translateInput = (
  input: UI.ActionConfirmation,
  actionData: ActionData<any, any>,
  t: UI.TranslateF,
): UI.ActionConfirmation => {
  const { approveCaption, rejectCaption, checkboxCaption, content } = input;

  const ret = {
    approveCaption: t(
      toFieldI18nKey('Approve', actionData, UI.SubNamespaces.PROMPTS),
      approveCaption,
    ),
    rejectCaption: !rejectCaption
      ? undefined
      : t(toFieldI18nKey('Reject', actionData, UI.SubNamespaces.PROMPTS), rejectCaption),
    checkboxCaption: !checkboxCaption
      ? undefined
      : t(
          toFieldI18nKey('Checkbox', actionData, UI.SubNamespaces.PROMPTS),
          checkboxCaption,
        ),
    content: t(toFieldI18nKey('Content', actionData, UI.SubNamespaces.PROMPTS), {
      defaultValue: content,
      replace: {
        item: actionData.itemData,
      },
    }),
  };

  return ret;
};

const isSidebarAction = (actionId: string) =>
  actionId === 'browse' || actionId === 'message';

const getCommonConfirmDialogProps = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  actionData: ActionData<ItemDataT, EntityT>,
  confirmation: UI.ActionConfirmation,
  defaultRejectCaption: string,
  t: UI.TranslateF,
): Omit<ConfirmDialogProps, 'onApproved'> => {
  const { action, moduleData } = actionData;
  const { icon, displayName } = action;
  const { approveCaption, rejectCaption, content, checkboxCaption } = translateInput(
    confirmation!,
    actionData,
    t,
  );
  return {
    approveCaption,
    rejectCaption: rejectCaption || translate(defaultRejectCaption, t, UI.Modules.COMMON),
    content,
    icon,
    title: t(toActionI18nKey(action, moduleData.moduleId), displayName),
    checkboxCaption,
  };
};

interface ConfirmHandlerProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  onApproved: (data: boolean | string) => void;
  onRejected: () => void;
  actionData: ActionData<ItemDataT, EntityT> | null;
}

const ConfirmHandler = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>({
  actionData,
  onApproved,
  onRejected,
}: ConfirmHandlerProps<ItemDataT, EntityT>) => {
  const { t } = useTranslation();
  if (!actionData) {
    return null;
  }

  const { confirmation, input } = actionData.action;
  if (confirmation) {
    const options =
      typeof confirmation === 'object'
        ? confirmation
        : confirmation(actionData.itemData!);
    return (
      <ConfirmDialog
        onApproved={onApproved}
        onRejected={onRejected}
        {...getCommonConfirmDialogProps(actionData, options, 'No', t)}
      />
    );
  }

  if (input) {
    const options = typeof input === 'object' ? input : input(actionData.itemData!);
    if (options.inputProps.placeholder) {
      options.inputProps.placeholder = t(
        toFieldI18nKey('Placeholder', actionData, UI.SubNamespaces.PROMPTS),
        options.inputProps.placeholder,
      );
    }

    return (
      <InputDialog
        onApproved={onApproved}
        onRejected={onRejected}
        inputProps={options.inputProps}
        {...getCommonConfirmDialogProps(actionData, options, 'Cancel', t)}
      />
    );
  }

  return null;
};

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
          toFieldI18nKey('Success', actionData, UI.SubNamespaces.NOTIFICATIONS),
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
    } catch (e) {
      NotificationActions.error({
        title: translate('Action failed', t, UI.Modules.COMMON),
        message: !e ? undefined : typeof e === 'string' ? e : e.message,
      });
    }
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

  const handleConfirm = async (confirmData: boolean | string) => {
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
      <ConfirmHandler
        onApproved={handleConfirm}
        onRejected={closeConfirmation}
        actionData={confirmActionData}
      />
    </>
  );
};

export { ActionHandlerDecorator };
