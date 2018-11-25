'use strict';
import React, { useEffect, useState } from 'react';
import History from 'utils/History';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { Location } from 'history';
import { useStore } from 'effects/StoreListenerEffect';


interface AuthenticationGuardDecoratorProps {
  location: Location;
}


interface LoginState {
  socketAuthenticated: boolean;
  lastError: string;
  hasSession: boolean;
}


const useLoginGuard = (login: LoginState, location: Location) => {
  const [ prevSocketAuthenticated, setPrevSocketAuthenticated ] = useState(LoginStore.getState().socketAuthenticated);

  useEffect(
    () => {
      if (login.hasSession && !login.socketAuthenticated) {
        if (prevSocketAuthenticated) {
          // Connection lost, reconnect (but not too fast)
          console.log('UI: Socket closed, attempting to reconnect in 2 seconds');
          setTimeout(() => LoginActions.connect(LoginStore.authToken), 2000);
        } else {
          // The page was loaded with a cached session token, attempt to reconnect
          LoginActions.connect(LoginStore.authToken);
        }
      } else if (!login.hasSession) {
        // Go to the login page as we don't have a valid session
        // Return to this page if the session was lost (instead of having been logged out) 

        console.log('UI: Redirecting to login page');
        History.replace({
          state: LoginStore.lastError !== null ? { nextPath: location.pathname } : null, 
          pathname: '/login',
        });
      }

      setPrevSocketAuthenticated(login.socketAuthenticated);
    },
    [ login.socketAuthenticated, login.hasSession ]
  );
};

function AuthenticationGuardDecorator<PropsT>(
  Component: React.ComponentType<PropsT>
) {
  const Decorator: React.FC<PropsT & AuthenticationGuardDecoratorProps> = props => {
    const login = useStore<LoginState>(LoginStore);
    useLoginGuard(login, props.location);

    if (!login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus 
          active={ true } 
          lastError={ login.lastError }
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
