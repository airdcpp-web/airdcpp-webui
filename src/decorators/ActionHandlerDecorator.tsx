import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import * as UI from 'types/ui';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';
import { withModalCloseContext, ModalCloseContextProps } from 'decorators/ModalRouteDecorator';
import { InputDialog } from 'components/semantic/InputDialog';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';

import { startCase } from 'lodash';


interface ActionHandlerDecoratorProps {

}

export interface ActionData<ItemDataT = any> extends Pick<UI.ModuleActions<ItemDataT>, 'moduleId' | 'subId'> {
  actionId: string;
  action: UI.ActionType<ItemDataT>;
  itemData: ItemDataT | undefined;
}

export type ActionClickHandler<ItemDataT = any> = (action: ActionData<ItemDataT>) => void;

export interface ActionHandlerDecoratorChildProps<ItemDataT = any> extends RouteComponentProps {
  onClickAction: ActionClickHandler<ItemDataT>;
}

const toKey = (fieldName: string, actionData: ActionData) => {
  let keyName = actionData.actionId;
  if (actionData.subId) {
    keyName += startCase(actionData.subId);
  }

  keyName += startCase(fieldName);

  return toI18nKey(
    keyName,
    [ actionData.moduleId, UI.SubNamespaces.ACTIONS, UI.SubNamespaces.PROMPTS ]
  );
};

const translateInput = (
  input: UI.ActionConfirmation,
  actionData: ActionData,
  t: i18next.TFunction
): UI.ActionConfirmation => {
  const { approveCaption, rejectCaption, checkboxCaption, content } = input;

  const ret = {
    approveCaption: t(toKey('Approve', actionData), approveCaption),
    rejectCaption: rejectCaption ? t(toKey('Reject', actionData), rejectCaption) : undefined,
    content: t(toKey('Content', actionData), {
      defaultValue: content,
      replace: {
        item: actionData.itemData,
      },
    }),
    checkboxCaption: checkboxCaption ? t(toKey('Checkbox', actionData), checkboxCaption) : undefined,
  };

  return ret;
};


const isSidebarAction = (actionId: string) => actionId === 'browse' || actionId === 'message';

const getCommonConfirmDialogProps = <ItemDataT extends {}>(
  actionData: ActionData<ItemDataT>,
  confirmation: UI.ActionConfirmation,
  defaultRejectCaption: string,
  t: i18next.TFunction,
): Omit<ConfirmDialogProps, 'onApproved'> => {
  const { icon, displayName } = actionData.action;
  const { approveCaption, rejectCaption, content, checkboxCaption } = translateInput(confirmation!, actionData, t);
  return {
    approveCaption, 
    rejectCaption: rejectCaption || translate(defaultRejectCaption, t, UI.Modules.COMMON),
    content,
    icon,
    title: displayName,
    checkboxCaption,
  };
};

interface ConfirmHandlerProps<ItemDataT> {
  onApproved: (data: boolean | string) => void;
  onRejected: () => void;
  actionData: ActionData<ItemDataT> | null;
}

const ConfirmHandler = <ItemDataT extends any>(
  { actionData, onApproved, onRejected }: ConfirmHandlerProps<ItemDataT>
) => {
  const { t } = useTranslation();
  if (!actionData) {
    return null;
  }

  const { confirmation, input } = actionData.action;
  if (confirmation) {
    const options = typeof confirmation === 'object' ? confirmation : confirmation(actionData.itemData!);
    return (
      <ConfirmDialog
        onApproved={ onApproved }
        onRejected={ onRejected }
        { ...getCommonConfirmDialogProps(actionData, options, 'No', t) }
      />
    );
  }

  if (input) {
    const options = typeof input === 'object' ? input : input(actionData.itemData!);
    if (options.inputProps.placeholder) {
      options.inputProps.placeholder = t(
        toKey('Placeholder', actionData),
        options.inputProps.placeholder
      );
    }

    return (
      <InputDialog
        onApproved={ onApproved }
        onRejected={ onRejected }
        inputProps={ options.inputProps }
        { ...getCommonConfirmDialogProps(actionData, options, 'Cancel', t) }
      />
    );
  }

  return null;
};

type ActionHandlerDataProps = RouteComponentProps & ModalCloseContextProps;

function ActionHandlerDecorator<PropsT, ItemDataT = any>(
  Component: React.ComponentType<PropsT & ActionHandlerDecoratorChildProps<ItemDataT>>
) {
  interface State {
    confirmActionData: ActionData<ItemDataT> | null;
  }

  type Props = PropsT & ActionHandlerDecoratorProps & ActionHandlerDataProps;
  class ActionHandler extends React.PureComponent<Props, State> {
    state: State = {
      confirmActionData: null,
    };
  
    handleAction = async (actionData: ActionData<ItemDataT>, confirmData: boolean | string | undefined) => {
      const { actionId, action, itemData } = actionData;
      const { closeModal } = this.props;
      if (!!closeModal && isSidebarAction(actionId)) {
        closeModal();
      }

      setTimeout(() => {
        const { location } = this.props;
        action(itemData, location, confirmData);
      });
    }

    closeConfirmation = () => {
      setTimeout(() => {
        this.setState({
          confirmActionData: null,
        });
      });
    }

    handleConfirm = async (data: boolean | string) => {
      const { confirmActionData } = this.state;
      if (!confirmActionData) {
        return;
      }

      await this.handleAction(confirmActionData, data);
      this.closeConfirmation();
    }
  
    handleClickAction: ActionClickHandler<ItemDataT> = (actionData) => {
      if (actionData.action.confirmation) {
        this.setState({
          confirmActionData: actionData,
        });
      } else if (actionData.action.input) { 
        this.setState({
          confirmActionData: actionData,
        });
      } else {
        this.handleAction(actionData, undefined);
      }
    }

    render() {
      const { confirmActionData } = this.state;
      const { closeModal, ...other } = this.props;
      return (
        <>
          <Component
            { ...other as PropsT & ActionHandlerDataProps }
            onClickAction={ this.handleClickAction }
          />
          <ConfirmHandler
            onApproved={ this.handleConfirm }
            onRejected={ this.closeConfirmation }
            actionData={ confirmActionData }
          />
        </>
      );
    }
  }

  return withRouter(withModalCloseContext(ActionHandler));
}

export { ActionHandlerDecorator };