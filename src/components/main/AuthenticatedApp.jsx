'use strict';
import React from 'react';

import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';

import ActivityTracker from './ActivityTracker';
import Notifications from './Notifications';
import BrowserUtils from 'utils/BrowserUtils';

import AuthenticationGuardDecorator from './decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from './MainLayoutMobile';
import MainLayoutNormal from './MainLayoutNormal';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';
import ViewFileActions from 'actions/ViewFileActions';
import EventActions from 'actions/EventActions';
import SystemActions from 'actions/SystemActions';


class AuthenticatedApp extends React.Component {
  updateTitle() {
    let title = 'AirDC++ Web Client';
    if (LoginStore.systemInfo) {
      title = LoginStore.systemInfo.hostname + ' - ' + title;
    }

    document.title = title;
  }

  componentDidMount() {
    this.updateTitle();

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
  }

  componentWillUnmount() {
    this.updateTitle();
  }

  render() {
    const MainLayout = BrowserUtils.useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications location={ this.props.location }/>
        <MainLayout 
          className="main-layout" 
          { ...this.props } 
        />
      </div>
    );
  }
};

export default AuthenticationGuardDecorator(AuthenticatedApp);
