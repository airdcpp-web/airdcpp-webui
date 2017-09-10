import React from 'react';
import { Router } from 'react-router';

import LoginStore from 'stores/LoginStore';
import History from 'utils/History';

import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingStore from 'stores/LocalSettingStore';

import Background1500px from '../resources/images/background_1500px.jpg';
import Background3460px from '../resources/images/background_3460px.jpg';
import BrowserUtils from 'utils/BrowserUtils';

import Measure from 'react-measure';

import 'array.prototype.find';
import './utils/semantic';

import 'style.css';

global.Promise = Promise;


Reflux.use(RefluxPromise(Promise));

const requireAuth = (nextState, replace) => {
  if (!LoginStore.hasSession) {
    replace({ 
      state: {
        nextPath: nextState.location.pathname,
      },
      pathname: '/login',
    });
  }
};

const onEnterSidebar = (nextProps, replace) => {
  // Don't allow sidebar to be accessed with a direct link
  if (!History.hasSidebar(nextProps.location)) {
    replace({
      pathname: '/',
    });
  }
};

// Path can't be passed to indexRoute
const { path, ...indexRoute } = require('./routes/Home'); // eslint-disable-line

const routeConfig = [
  require('./routes/Login'),
  { 
    component: require('./components/main/AuthenticatedApp').default,
    path: '/',
    onEnter: requireAuth,
    indexRoute: indexRoute,
    childRoutes: [
      require('./routes/Home'),
      require('./routes/FavoriteHubs'),
      require('./routes/Queue'),
      require('./routes/Search'),
      require('./routes/Settings'),
      require('./routes/Transfers'),
      require('./routes/Share'),
      { 
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
      }
    ]
  }
];

const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (BrowserUtils.useMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3460px;
};


const App = _ => (
  <Measure
    bounds={ true }
  >
    { ({ measureRef }) => (
      <div ref={ measureRef } id="background-wrapper" 
        style={{
				 backgroundImage: 'url(' + getBackgroundImage() + ')',
				 height: '100%',
        }}
      >
        <Router history={ History } routes={ routeConfig } />
      </div>
    ) }
  </Measure>
);

export default App;
