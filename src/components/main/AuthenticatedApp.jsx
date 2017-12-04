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


const mainRoutes = [
  require('../../routes/Home').default,
  require('../../routes/FavoriteHubs').default,
  require('../../routes/Queue').default,
  require('../../routes/Search').default,
  //require('../../routes/Settings').default,
  require('../../routes/Share').default,
  require('../../routes/Transfers').default,
];

const secondaryRoutes = [
  require('../../routes/Sidebar/routes/Hubs').default,
  require('../../routes/Sidebar/routes/Filelists').default,
  require('../../routes/Sidebar/routes/Messages').default,
  require('../../routes/Sidebar/routes/Files').default,
  require('../../routes/Sidebar/routes/Events').default,
];

class AuthenticatedApp extends React.Component {
  componentWillMount() {
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

  render() {
    const MainLayout = BrowserUtils.useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications location={ this.props.location }/>
        <MainLayout 
          className="pushable main-layout" 
          { ...this.props } 
          mainRoutes={ mainRoutes } 
          secondaryRoutes={ secondaryRoutes }
        />
      </div>
    );
  }
};

export default AuthenticationGuardDecorator(AuthenticatedApp);
