'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import History from 'utils/History';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import SocketConnectStatus from './../SocketConnectStatus';


const AuthenticationGuardDecorator = (Component) => {
  return createReactClass({
    displayName: 'AuthenticationGuardDecorator',
    mixins: [ 
      Reflux.connect(LoginStore, 'login')
    ],

    propTypes: {
      location: PropTypes.object.isRequired,
    },

    updateTitle() {
      let title = 'AirDC++ Web Client';
      if (LoginStore.systemInfo) {
        title = LoginStore.systemInfo.hostname + ' - ' + title;
      }

      document.title = title;
    },

    componentWillMount() {
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

    componentWillUpdate(nextProps, nextState) {
      if (nextState.login.hasSession && this.state.login.socketAuthenticated && !nextState.login.socketAuthenticated) {
        // Connection lost, reconnect (but not too fast)
        console.log('UI: Socket closed, attempting to reconnect in 2 seconds');
        setTimeout(() => LoginActions.connect(LoginStore.authToken), 2000);
      } else if (this.state.login.hasSession && !nextState.login.hasSession) {
        // Go to the login page as we don't have a valid session anymore
        // Return to this page if the session was lost (instead of having logged out) 

        console.log('UI: Redirecting to login page');
        History.replace({
          state: LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, 
          pathname: '/login',
        });

        this.updateTitle();
      } else if (!this.state.login.socketAuthenticated && nextState.login.socketAuthenticated) {
        this.updateTitle();
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
          //login={ login }
        />
      );
    }
  });
};

export default AuthenticationGuardDecorator;
