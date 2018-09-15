'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';
import History from 'utils/History';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { Location } from 'history';


interface AuthenticationGuardDecoratorProps {
  location: Location;
}

function AuthenticationGuardDecorator<PropsT>(
  Component: React.ComponentType<PropsT>
) {
  return createReactClass<PropsT & AuthenticationGuardDecoratorProps, {}>({
    displayName: 'AuthenticationGuardDecorator',
    mixins: [ 
      Reflux.connect(LoginStore, 'login')
    ],

    propTypes: {
      location: PropTypes.object.isRequired,
    },

    componentDidMount() {
      const { login } = this.state;
      if (login.hasSession) {
        if (!login.socketAuthenticated) {
          // The page was loaded with a cached session token, attempt to reconnect
          LoginActions.connect(LoginStore.authToken);
        }
      } else {
        // Go to login page
        History.replace({ 
          state: {
            nextPath: this.props.location.pathname,
          },
          pathname: '/login',
        });
      }
    },

    componentDidUpdate(prevProps: AuthenticationGuardDecoratorProps, prevState: any) {
      if (this.state.login.hasSession && prevState.login.socketAuthenticated && !this.state.login.socketAuthenticated) {
        // Connection lost, reconnect (but not too fast)
        console.log('UI: Socket closed, attempting to reconnect in 2 seconds');
        setTimeout(() => LoginActions.connect(LoginStore.authToken), 2000);
      } else if (prevState.login.hasSession && !this.state.login.hasSession) {
        // Go to the login page as we don't have a valid session anymore
        // Return to this page if the session was lost (instead of having logged out) 

        console.log('UI: Redirecting to login page');
        History.replace({
          state: LoginStore.lastError !== null ? { nextPath: prevProps.location.pathname } : null, 
          pathname: '/login',
        });
      }
    },

    render() {
      const { login } = this.state;
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
          { ...this.props }
        />
      );
    }
  });
}

export default AuthenticationGuardDecorator;
