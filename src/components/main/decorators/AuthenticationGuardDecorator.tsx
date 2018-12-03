'use strict';
import React from 'react';
import { Location } from 'history';

import LoginStore, { LoginState } from 'stores/LoginStore';

import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { useStore } from 'effects/StoreListenerEffect';
import { useLoginGuard } from '../effects/LoginGuardEffect';
import { usePageTitle } from '../effects/PageTitleEffect';
import { useStoreDataFetch } from '../effects/StoreDataFetchEffect';


interface AuthenticationGuardDecoratorProps {
  location: Location;
}



const getConnectStatusMessage = (lastError: string | null) => {
  if (!!lastError) {
    return lastError + '. Attempting to re-establish connection...';
  }

  return 'Connecting to the server...';
};

function AuthenticationGuardDecorator<PropsT>(
  Component: React.ComponentType<PropsT>
) {
  const Decorator: React.FC<PropsT & AuthenticationGuardDecoratorProps> = props => {
    const login = useStore<LoginState>(LoginStore);
    useLoginGuard(login, props.location);
    usePageTitle(login);
    useStoreDataFetch(login);

    if (!login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus 
          message={ getConnectStatusMessage(login.lastError) }
        />
      );
    }

    return (
      <Component 
        { ...props }
      />
    );
  };

  return Decorator;
}

export default AuthenticationGuardDecorator;
