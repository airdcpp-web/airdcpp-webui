'use strict';
import React from 'react';

import LoginStore from 'stores/LoginStore';

import ActivityTracker from 'components/main/ActivityTracker';
import Notifications from 'components/main/Notifications';
import { useMobileLayout } from 'utils/BrowserUtils';

import AuthenticationGuardDecorator from 'components/main/decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from 'components/main/MainLayoutMobile';
import MainLayoutNormal from 'components/main/MainLayoutNormal';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';
import ViewFileActions from 'actions/ViewFileActions';
import EventActions from 'actions/EventActions';
import SystemActions from 'actions/SystemActions';
import { RouteComponentProps } from 'react-router-dom';

import { AccessEnum } from 'types/api';


interface AuthenticatedAppProps extends RouteComponentProps<{}> {

}

export interface MainLayoutProps extends RouteComponentProps {
  className?: string;
}

class AuthenticatedApp extends React.Component<AuthenticatedAppProps> {
  updateTitle() {
    let title = 'AirDC++ Web Client';
    if (LoginStore.systemInfo) {
      title = LoginStore.systemInfo.hostname + ' - ' + title;
    }

    document.title = title;
  }

  componentDidMount() {
    this.updateTitle();

    if (LoginStore.hasAccess(AccessEnum.PRIVATE_CHAT_VIEW)) {
      PrivateChatActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessEnum.HUBS_VIEW)) {
      HubActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessEnum.FILELISTS_VIEW)) {
      FilelistSessionActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessEnum.VIEW_FILE_VIEW)) {
      ViewFileActions.fetchSessions();
    }

    if (LoginStore.hasAccess(AccessEnum.EVENTS_VIEW)) {
      EventActions.fetchInfo();
    }

    SystemActions.fetchAway();
  }

  componentWillUnmount() {
    this.updateTitle();
  }

  render() {
    const { location } = this.props;

    const MainLayout = useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications location={ location }/>
        <MainLayout 
          className="main-layout" 
          { ...this.props } 
        />
      </div>
    );
  }
}

export default AuthenticationGuardDecorator(AuthenticatedApp);
