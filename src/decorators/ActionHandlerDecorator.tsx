import { useState, useContext } from 'react';
import * as React from 'react';

import { RouteComponentProps, useLocation } from 'react-router-dom';

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
import { Location } from 'history';

interface ActionHandlerDecoratorProps<ItemDataT> {
  children: (props: ActionHandlerDecoratorChildProps<ItemDataT>) => React.ReactNode;
}

export interface ActionData<ItemDataT = any>
  extends Pick<UI.ModuleActions<ItemDataT>, 'moduleId' | 'subId'> {
  actionId: string;
  action: UI.ActionType<ItemDataT>;
  itemData: ItemDataT;
}

export type ActionClickHandler<ItemDataT = any> = (action: ActionData<ItemDataT>) => void;

export interface ActionHandlerDecoratorChildProps<ItemDataT = any>
  extends Pick<RouteComponentProps, 'location'> {
  onClickAction: ActionClickHandler<ItemDataT>;
}

const toFieldI18nKey = (
  fieldName: string,
  actionData: ActionData,
  subNameSpace: UI.SubNamespaces
) => {
  let keyName = actionData.actionId;
  if (actionData.subId) {
    keyName += upperFirst(actionData.subId);
  }

  keyName += upperFirst(fieldName);

  return toI18nKey(keyName, [
    ...toArray(actionData.moduleId),
    UI.SubNamespaces.ACTIONS,
    subNameSpace,
  ]);
};

const translateInput = (
  input: UI.ActionConfirmation,
  actionData: ActionData,
  t: UI.TranslateF
): UI.ActionConfirmation => {
  const { approveCaption, rejectCaption, checkboxCaption, content } = input;

  const ret = {
    approveCaption: t(
      toFieldI18nKey('Approve', actionData, UI.SubNamespaces.PROMPTS),
      approveCaption
    ),
    rejectCaption: !rejectCaption
      ? undefined
      : t(toFieldI18nKey('Reject', actionData, UI.SubNamespaces.PROMPTS), rejectCaption),
    checkboxCaption: !checkboxCaption
      ? undefined
      : t(
          toFieldI18nKey('Checkbox', actionData, UI.SubNamespaces.PROMPTS),
          checkboxCaption
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

const getCommonConfirmDialogProps = <ItemDataT extends UI.ActionItemDataValueType>(
  actionData: ActionData<ItemDataT>,
  confirmation: UI.ActionConfirmation,
  defaultRejectCaption: string,
  t: UI.TranslateF
): Omit<ConfirmDialogProps, 'onApproved'> => {
  const { icon, displayName } = actionData.action;
  const { approveCaption, rejectCaption, content, checkboxCaption } = translateInput(
    confirmation!,
    actionData,
    t
  );
  return {
    approveCaption,
    rejectCaption: rejectCaption || translate(defaultRejectCaption, t, UI.Modules.COMMON),
    content,
    icon,
    title: t(toActionI18nKey(actionData.action, actionData.moduleId), displayName),
    checkboxCaption,
  };
};

interface ConfirmHandlerProps<ItemDataT> {
  onApproved: (data: boolean | string) => void;
  onRejected: () => void;
  actionData: ActionData<ItemDataT> | null;
}

const ConfirmHandler = <ItemDataT extends UI.ActionItemDataValueType>({
  actionData,
  onApproved,
  onRejected,
}: ConfirmHandlerProps<ItemDataT>) => {
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
        options.inputProps.placeholder
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

const handleAction = async <ItemDataT extends UI.ActionItemDataValueType>(
  actionData: ActionData<ItemDataT>,
  confirmData: boolean | string | undefined,
  location: Location,
  t: UI.TranslateF,
  closeModal: ModalCloseContext | undefined
) => {
  const { actionId, action, itemData } = actionData;
  if (!!closeModal && isSidebarAction(actionId)) {
    closeModal();
  }

  setTimeout(async () => {
    const handlerData: UI.ActionHandlerData<ItemDataT> = {
      data: itemData,
      location,
      t,
    };

    try {
      const result = await action.handler(handlerData, confirmData);
      if (action.notifications && action.notifications.onSuccess) {
        const message = t(
          toFieldI18nKey('Success', actionData, UI.SubNamespaces.NOTIFICATIONS),
          {
            defaultValue: action.notifications.onSuccess,
            replace: {
              item: itemData,
              result,
            },
          }
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

type Props<ItemDataT> = ActionHandlerDecoratorProps<ItemDataT>;

const ActionHandlerDecorator = <ItemDataT extends UI.ActionItemDataValueType>(
  props: Props<ItemDataT>
) => {
  const [confirmActionData, setConfirmActionData] =
    useState<ActionData<ItemDataT> | null>(null);
  const { t } = useTranslation();
  const closeModal = useContext(ModalRouteCloseContext);
  const location = useLocation();

  const closeConfirmation = () => {
    setTimeout(() => setConfirmActionData(null));
  };

  const handleConfirm = async (data: boolean | string) => {
    if (!confirmActionData) {
      return;
    }

    await handleAction(confirmActionData, data, location, t, closeModal);
    closeConfirmation();
  };

  const handleClickAction: ActionClickHandler<ItemDataT> = (actionData) => {
    if (actionData.action.confirmation) {
      setConfirmActionData(actionData);
    } else if (actionData.action.input) {
      setConfirmActionData(actionData);
    } else {
      handleAction(actionData, undefined, location, t, closeModal);
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
