import React from 'react';
import { Router, Route, Switch } from 'react-router';

import History from 'utils/History';

import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import BackgroundWrapper from './components/main/BackgroundWrapper';

import AuthenticatedApp from './components/main/AuthenticatedApp';
import Login from './routes/Login';

import 'array.prototype.find';
import './utils/semantic';

import 'style.css';

global.Promise = Promise;


Reflux.use(RefluxPromise(Promise));

/*const requireAuth = (nextState, replace) => {
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
};*/

const App = _ => (
  <BackgroundWrapper>
    <Router history={ History }>
      <Switch>
        <Route path="/login" component={ Login.component }/>
        <Route path="/" component={ AuthenticatedApp }/>
      </Switch>
    </Router>
  </BackgroundWrapper>
);

export default App;
