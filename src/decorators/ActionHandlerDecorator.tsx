import * as React from 'react';

import { withRouter, RouteComponentProps } from 'react-router';

import * as UI from 'types/ui';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';
import { withModalCloseContext, ModalCloseContextProps } from 'decorators/ModalRouteDecorator';
import { InputDialog } from 'components/semantic/InputDialog';



interface ActionHandlerDecoratorProps {

}

export interface ActionData<ItemDataT = any> {
  actionId: string;
  action: UI.ActionType<ItemDataT>;
  itemData: ItemDataT | undefined;
}

export type ActionClickHandler<ItemDataT = any> = (action: ActionData<ItemDataT>) => void;

export interface ActionHandlerDecoratorChildProps<ItemDataT = any> extends RouteComponentProps {
  onClickAction: ActionClickHandler<ItemDataT>;
}


const isSidebarAction = (actionId: string) => actionId === 'browse' || actionId === 'message';

const getCommonConfirmDialogProps = <ItemDataT extends {}>(
  actionData: ActionData<ItemDataT>,
  confirmation: UI.ActionConfirmation,
): Omit<ConfirmDialogProps, 'onApproved'> => {
  const { icon, displayName } = actionData.action;
  const { approveCaption, rejectCaption, content, checkboxCaption } = confirmation!;
  return {
    approveCaption,
    rejectCaption,
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
        { ...getCommonConfirmDialogProps(actionData, options) }
      />
    );
  }

  if (input) {
    const options = typeof input === 'object' ? input : input(actionData.itemData!);
    return (
      <InputDialog
        onApproved={ onApproved }
        onRejected={ onRejected }
        inputProps={ options.inputProps }
        { ...getCommonConfirmDialogProps(actionData, options) }
      />
    );
  }

  return null;
};

type ActionHandlerDataProps = ActionHandlerDecoratorProps & RouteComponentProps & ModalCloseContextProps;

function ActionHandlerDecorator<PropsT, ItemDataT = any>(
  Component: React.ComponentType<PropsT & ActionHandlerDecoratorChildProps>
) {
  interface State {
    confirmActionData: ActionData<ItemDataT> | null;
  }

  type Props = PropsT & ActionHandlerDataProps;
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
        //if ((action as UI.ConfirmActionType<ItemDataT>).confirmed) {
        //  (action as UI.ConfirmActionType<ItemDataT>).confirmed(itemData, location, confirmData);
        //} else {
        action(itemData, location, confirmData);
        //}
      });
    }

    closeConfirmation = () => {
      this.setState({
        confirmActionData: null,
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
  
    handleClickAction: ActionClickHandler<ItemDataT> = (actionData: ActionData<ItemDataT>) => {
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
      const { closeModal, ...other } = this.props as ActionHandlerDataProps;
      return (
        <>
          <Component
            { ...other }
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