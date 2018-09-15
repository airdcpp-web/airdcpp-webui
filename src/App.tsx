import React from 'react';
import { Router, Route, Switch } from 'react-router';

import History from 'utils/History';

//@ts-ignore
import Reflux from 'reflux';
//@ts-ignore
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import AuthenticatedApp from 'components/main/AuthenticatedApp';
import Login from 'routes/Login/components/Login';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingStore from 'stores/LocalSettingStore';

import Background1500px from '../resources/images/background_winter_1500px.jpg';
import Background3840px from '../resources/images/background_winter_3840px.jpg';
import { useMobileLayout } from 'utils/BrowserUtils';

import Measure from 'react-measure';

import 'array.prototype.find';
import 'utils/semantic';

import 'style.css';

global.Promise = Promise;


Reflux.use(RefluxPromise(Promise));


const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (useMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3840px;
};


const App = () => (
  <Router history={ History }>
    <Measure
      bounds={ true }
    >
      { ({ measureRef }) => (
        <div 
          ref={ measureRef } 
          id="background-wrapper" 
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
