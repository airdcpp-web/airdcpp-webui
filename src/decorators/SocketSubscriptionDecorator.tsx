import * as React from 'react';

import {
  SubscriptionRemoveHandler,
  SubscriptionCallback,
  EntityId,
} from 'airdcpp-apisocket';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useSocket } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';
import { hasAccess } from '@/utils/AuthUtils';
import { useSession } from '@/context/AppStoreContext';

export interface SocketSubscriptionDecoratorProps {
  session?: UI.SessionItemBase;
}

export type AddSocketListener = <
  DataT extends object | void,
  EntityIdT extends EntityId | undefined = undefined,
>(
  apiModuleUrl: string,
  event: string,
  callback: SubscriptionCallback<DataT, EntityIdT>,
  entityId?: EntityIdT,
  access?: API.AccessEnum,
) => void;

export interface SocketSubscriptionDecoratorChildProps<PropsT = unknown> {
  addSocketListener: AddSocketListener;
  removeSocketListeners: (props?: PropsT) => void;
  socket: APISocket;
  session: UI.AuthenticatedSession;
}

const SocketSubscriptionDecorator = function <PropsT extends object>(
  Component: React.ComponentType<SocketSubscriptionDecoratorChildProps<PropsT> & PropsT>,

  // An optional function that will skip removal of listeners from the API in case "false" is being returned
  // This will help to avoid API errors that would happen when removing listeners for non-existing sessions
  entityExistsValidator?: (props: PropsT) => boolean,
) {
  const Decorator: React.FC<PropsT & SocketSubscriptionDecoratorProps> = (props) => {
    const socketSubscriptions = React.useRef<SubscriptionRemoveHandler[]>([]);
    const socket = useSocket();
    // const login = useAppStoreProperty((state) => state.login);
    const session = useSession();

    const addSocketListener = async <
      DataT extends object | void,
      EntityIdT extends EntityId | undefined,
    >(
      apiModuleUrl: string,
      event: string,
      callback: SubscriptionCallback<DataT, EntityIdT>,
      entityId: EntityId | undefined,
      access: API.AccessEnum,
    ) => {
      if (access && !hasAccess(session, access)) {
        return;
      }

      const removeHandler = await socket.addListener<DataT, EntityIdT>(
        apiModuleUrl,
        event,
        callback,
        entityId,
      );

      socketSubscriptions.current.push(removeHandler);
    };

    const removeSocketListeners = (removeProps: PropsT = props) => {
      const entityExists = !entityExistsValidator || entityExistsValidator(removeProps);

      socketSubscriptions.current.forEach((f) => f(entityExists));
      socketSubscriptions.current = [];
    };

    React.useEffect(() => {
      return () => {
        removeSocketListeners();
      };
    }, []);

    return (
      <Component
        {...props}
        addSocketListener={addSocketListener}
        removeSocketListeners={removeSocketListeners}
        socket={socket}
        session={session}
      />
    );
  };

  return Decorator;
};

export { SocketSubscriptionDecorator };
