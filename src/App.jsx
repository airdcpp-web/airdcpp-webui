import React from 'react';
import { Router, Route, Switch } from 'react-router';

import History from 'utils/History';

import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import AuthenticatedApp from './components/main/AuthenticatedApp';
import Login from './routes/Login/components/Login';

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

/*const onEnterSidebar = (nextProps, replace) => {
  // Don't allow sidebar to be accessed with a direct link
  if (!History.hasSidebar(nextProps.location)) {
    replace({
      pathname: '/',
    });
  }
};*/


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
  <Router history={ History }>
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
          <Switch>
            <Route path="/login" component={ Login }/>
            <Route path="/" component={ AuthenticatedApp }/>
          </Switch>
        </div>
      ) }
    </Measure>
  </Router>
);

export default App;
