'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import invariant from 'invariant';
import { LocationContext } from 'mixins/RouterMixin';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';

import ActivityTracker from './ActivityTracker';
import Notifications from './Notifications';
import BrowserUtils from 'utils/BrowserUtils';

import MainLayoutMobile from './MainLayoutMobile';
import MainLayoutNormal from './MainLayoutNormal';

import SocketConnectStatus from './SocketConnectStatus';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';
import ViewFileActions from 'actions/ViewFileActions';
import EventActions from 'actions/EventActions';
import SystemActions from 'actions/SystemActions';


const AuthenticatedApp = createReactClass({
  displayName: 'AuthenticatedApp',

  mixins: [ 
    Reflux.connect(LoginStore, 'login'),
    LocationContext,
  ],

  contextTypes: {
    router: PropTypes.object
  },

  updateTitle() {
    let title = 'AirDC++ Web Client';
    if (LoginStore.systemInfo) {
      title = LoginStore.systemInfo.hostname + ' - ' + title;
    }

    document.title = title;
  },

  onSocketAuthenticated() {
    if (LoginStore.hasAccess(AccessConstants.PRIVATE_CHAT_VIEW)) {
      PrivateChatActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessConstants.HUBS_VIEW)) {
      HubActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessConstants.FILELISTS_VIEW)) {
      FilelistSessionActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessConstants.VIEW_FILE_VIEW)) {
      ViewFileActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessConstants.EVENTS_VIEW)) {
      EventActions.fetchInfo();
    }

    SystemActions.fetchAway();

    this.updateTitle();
  },

  componentWillMount() {
    const { login } = this.state;
    if (login.hasSession) {
      if (login.socketAuthenticated) {
        this.onSocketAuthenticated();
      } else {
        // The page was loaded with a cached session token, attempt to reconnect
        LoginActions.connect(LoginStore.authToken);
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.login.hasSession && this.state.login.socketAuthenticated && !nextState.login.socketAuthenticated) {
      // Reconnect (but not too fast)
      console.log('UI: Socket closed, attempting to reconnect in 2 seconds');
      setTimeout(() => LoginActions.connect(LoginStore.authToken), 2000);
    } else if (this.state.login.hasSession && !nextState.login.hasSession) {
      // Go to the login page as we don't have a valid session anymore
      // Return to this page if the session was lost (instead of having logged out) 

      console.log('UI: Redirecting to login page');
      this.context.router.replace({
        state: LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, 
        pathname: '/login',
      });

      this.updateTitle();
    } else if (!this.state.login.socketAuthenticated && nextState.login.socketAuthenticated) {
      this.onSocketAuthenticated();
    }
  },

  render() {
    invariant(this.props.children, 'AuthenticatedApp should always have children');
    if (!this.state.login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus 
          active={ true } 
          lastError={ this.state.login.lastError }
        />
      );
    }

    const LayoutElement = BrowserUtils.useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications/>
        <LayoutElement className="pushable main-layout" { ...this.props }>
          { this.props.children }
        </LayoutElement>
      </div>
    );
  },
});

export default AuthenticatedApp;
