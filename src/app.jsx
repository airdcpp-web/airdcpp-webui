import React from 'react';
import { Router, Route, Link } from 'react-router';
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions';

// load tcomb-form without templates and i18n
var t = require('tcomb-form/lib');
var en = require('tcomb-form/lib/i18n/en');
var semantic = require('tcomb-form/lib/templates/semantic');

t.form.Form.i18n = en;
t.form.Form.templates = semantic;
React.initializeTouchEvents(true);

if (LoginStore.token) {
	LoginActions.connect(LoginStore.token);
}

function requireAuth(nextState, transition) {
	if (!LoginStore.user) {
	    transition({ nextPath: nextState.location.pathname }, '/login', null);
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


React.render(
  <Router history={ Router.BrowserHistory } routes={routeConfig} />,
  document.getElementById('content')
);
