import React from 'react';
import { Router, Route, Link } from 'react-router';
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions';
import History from './utils/History'

// load tcomb-form without templates and i18n
var t = require('tcomb-form/lib');

var semantic = require('tcomb-form/lib/templates/semantic');
t.form.Form.templates = semantic;

React.initializeTouchEvents(true);

if (LoginStore.token) {
	LoginActions.connect(LoginStore.token);
}

function requireAuth(nextState, replaceState) {
	if (!LoginStore.user) {
	    replaceState({ nextPath: nextState.location.pathname }, '/login', null);
	}
}

var routeConfig = [
  { 
  	path: '/login', 
  	component: require('./components/Login'), 
  }, 
  { 
    component: require('./components/AuthenticatedApp'),
    onEnter: requireAuth,
    childRoutes: [
      require('./routes/Home'),
      require('./routes/FavoriteHubs'),
      require('./routes/Queue'),
      require('./routes/Search'),
    ]
  }
]

var tmp = History;
var tmp2 = Router.BrowserHistory;

React.render(
  <Router history={ History } routes={routeConfig} />,
  document.getElementById('content')
);
