import React, { 
//  useContext 
} from 'react';

import { /*withRouter,*/ RouteComponentProps, withRouter } from 'react-router-dom';

import * as UI from 'types/ui';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';
import { ModalCloseContextProps, withModalCloseContext } from 'decorators/ModalRouteDecorator';
import { InputDialog } from 'components/semantic/InputDialog';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { translate, toI18nKey, toArray } from 'utils/TranslationUtils';

import { upperFirst } from 'lodash';
import { toActionI18nKey } from 'utils/ActionUtils';
//import { useRouter } from 'effects/RouterEffect';

//import useRouter from 'use-react-router';


interface ActionHandlerDecoratorProps<ItemDataT> {
  children: (props: ActionHandlerDecoratorChildProps<ItemDataT>) => React.ReactNode;
}

export interface ActionData<ItemDataT = any> extends Pick<UI.ModuleActions<ItemDataT>, 'moduleId' | 'subId'> {
  actionId: string;
  action: UI.ActionType<ItemDataT>;
  itemData: ItemDataT;
}

export type ActionClickHandler<ItemDataT = any> = (action: ActionData<ItemDataT>) => void;

export interface ActionHandlerDecoratorChildProps<ItemDataT = any> extends RouteComponentProps {
  onClickAction: ActionClickHandler<ItemDataT>;
}

const toKey = (fieldName: string, actionData: ActionData) => {
  let keyName = actionData.actionId;
  if (actionData.subId) {
    keyName += upperFirst(actionData.subId);
  }

  keyName += upperFirst(fieldName);

  return toI18nKey(
    keyName,
    [ ...toArray(actionData.moduleId), UI.SubNamespaces.ACTIONS, UI.SubNamespaces.PROMPTS ]
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
    title: t(toActionI18nKey(actionData.action, actionData.moduleId), displayName),
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

/*const handleAction = async <ItemDataT extends any>(
  actionData: ActionData<ItemDataT>, 
  confirmData: boolean | string | undefined,
) => {
  const { actionId, action, itemData } = actionData;
  //const { closeModal } = this.props;
  if (!!closeModal && isSidebarAction(actionId)) {
    closeModal();
  }

  setTimeout(async () => {
    const { location } = this.props;
    const handlerData = {
      data: itemData, 
      location
    };

    try {
      const res = await action.handler(handlerData, confirmData);
    } catch (e) {
      //
    }
  });
}*/

type ActionHandlerDataProps = RouteComponentProps & ModalCloseContextProps;

//function ActionHandlerDecorator<PropsT, ItemDataT = any>(
//  Component: React.ComponentType<PropsT & ActionHandlerDecoratorChildProps<ItemDataT>>
//) {
interface State<ItemDataT> {
  confirmActionData: ActionData<ItemDataT> | null;
}

type Props<ItemDataT> = /*PropsT &*/ ActionHandlerDecoratorProps<ItemDataT> & ActionHandlerDataProps;
class ActionHandlerDecorator<ItemDataT> extends React.PureComponent<Props<ItemDataT>, State<ItemDataT>> {
  state: State<ItemDataT> = {
    confirmActionData: null,
  };

  //static contextType = ModalRouteCloseContext;
  //context: ModalCloseContextProps;

  handleAction = async (
    actionData: ActionData<ItemDataT>, 
    confirmData: boolean | string | undefined,
  ) => {
    const { actionId, action, itemData } = actionData;
    //if (this.context) {
    const { closeModal } = this.props;
    if (!!closeModal && isSidebarAction(actionId)) {
      closeModal();
    }
    //}
  
    setTimeout(async () => {
      const { location } = this.props;
      const handlerData = {
        data: itemData, 
        location
      };
  
      try {
        await action.handler(handlerData, confirmData);
      } catch (e) {
        //
      }
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
    const { children, ...other } = this.props;
    return (
      <>
        {/*<Component
          { ...other as PropsT & ActionHandlerDataProps }
          onClickAction={ this.handleClickAction }
        />*/}
        { children({
          onClickAction: this.handleClickAction,
          ...other
        }) }
        <ConfirmHandler
          onApproved={ this.handleConfirm }
          onRejected={ this.closeConfirmation }
          actionData={ confirmActionData }
        />
      </>
    );
  }
}

/*const RouterProvider = <ItemDataT extends any>(props: ActionHandlerDecoratorProps<ItemDataT>) => {
  return (

  )
};*/

/*const ActionHandlerDecorator = <ItemDataT extends any>(props: ActionHandlerDecoratorProps<ItemDataT>) => {
  //const route = useRouter();
  //const closeModal = useContext(ModalRouteCloseContext);
  return (
    <ActionHandler
      { ...props as any }
      //closeModal={ closeModal }
      //{ ...route }
    />
  );
  //withRouter(withModalCloseContext(ActionHandler));
};*/

//  return withRouter(withModalCloseContext(ActionHandler));
//}

//export { ActionHandlerDecorator };


// TODO: replace with useRouter hook when possible
const Decorator = withModalCloseContext<ActionHandlerDecoratorProps<any>>(
  withRouter<Props<any>>(ActionHandlerDecorator)
);

export { Decorator as ActionHandlerDecorator };