'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import { LocationContext } from 'mixins/RouterMixin';

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

//import { Route, Switch } from 'react-router';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';


const routeConfig = [
  require('../../routes/Home').default,
  require('../../routes/FavoriteHubs').default,
  require('../../routes/Queue').default,
  require('../../routes/Search').default,
  require('../../routes/Share').default,
  require('../../routes/Transfers').default,
  
  /*{ 
    component: require('./routes/Sidebar/components/Sidebar').default,
    path: 'sidebar',
    onEnter: onEnterSidebar,
    childRoutes: [
      require('./routes/Sidebar/routes/Hubs'),
      require('./routes/Sidebar/routes/Filelists'), 
      require('./routes/Sidebar/routes/Messages'), 
      require('./routes/Sidebar/routes/Files'), 
      require('./routes/Sidebar/routes/Events'), 
    ]
  }*/
];

const AuthenticatedApp = createReactClass({
  mixins: [
    LocationContext,
  ],

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
  },

  render() {
    const LayoutElement = BrowserUtils.useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications/>
        <LayoutElement className="pushable main-layout" { ...this.props }>
          {/*<Switch>*/}
          { routeConfig.map((route, i) => (
            <RouteWithSubRoutes key={ i } { ...route }/>
          )) }
          {/*</Switch>*/}
        </LayoutElement>
      </div>
    );
  },
});

export default AuthenticationGuardDecorator(AuthenticatedApp);
