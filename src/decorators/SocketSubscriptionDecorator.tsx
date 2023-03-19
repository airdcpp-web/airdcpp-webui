import * as React from 'react';

import SocketService from 'services/SocketService';
import LoginStore from 'stores/LoginStore';

import {
  SubscriptionRemoveHandler,
  SubscriptionCallback,
  EntityId,
} from 'airdcpp-apisocket';
import { AccessEnum } from 'types/api';
import { SessionBaseType } from 'routes/Sidebar/components/SessionLayout';

export interface SocketSubscriptionDecoratorProps {
  session?: SessionBaseType;
}

export type AddSocketListener = <
  DataT extends object | void,
  EntityIdT extends EntityId | undefined = undefined
>(
  apiModuleUrl: string,
  event: string,
  callback: SubscriptionCallback<DataT, EntityIdT>,
  entityId?: EntityIdT,
  access?: AccessEnum
) => void;

export interface SocketSubscriptionDecoratorChildProps<PropsT = unknown> {
  addSocketListener: AddSocketListener;
  removeSocketListeners: (props?: PropsT) => void;
}

const SocketSubscriptionDecorator = function <PropsT extends object>(
  Component: React.ComponentType<SocketSubscriptionDecoratorChildProps<PropsT> & PropsT>,

  // An optional function that will skip removal of listeners from the API in case "false" is being returned
  // This will help to avoid API errors that would happen when removing listeners for non-existing sessions
  entityExistsValidator?: (props: PropsT) => boolean
) {
  class Decorator extends React.Component<PropsT & SocketSubscriptionDecoratorProps> {
    socketSubscriptions: SubscriptionRemoveHandler[] = [];

    addSocketListener = <
      DataT extends object | void,
      EntityIdT extends EntityId | undefined
    >(
      apiModuleUrl: string,
      event: string,
      callback: SubscriptionCallback<DataT, EntityIdT>,
      entityId: EntityId | undefined,
      access: AccessEnum
    ) => {
      if (access && !LoginStore.hasAccess(access)) {
        return;
      }

      SocketService.addListener<DataT, EntityIdT>(
        apiModuleUrl,
        event,
        callback,
        entityId
      ).then((removeHandler) => this.socketSubscriptions.push(removeHandler));
    };

    removeSocketListeners = (props: PropsT = this.props) => {
      const entityExists = !entityExistsValidator || entityExistsValidator(props);

      this.socketSubscriptions.forEach((f) => f(entityExists));
      this.socketSubscriptions = [];
    };

    componentWillUnmount() {
      this.removeSocketListeners();
    }

    render() {
      return (
        <Component
          {...this.props}
          addSocketListener={this.addSocketListener}
          removeSocketListeners={this.removeSocketListeners}
        />
      );
    }
  }

  return Decorator;
};

export { SocketSubscriptionDecorator };
