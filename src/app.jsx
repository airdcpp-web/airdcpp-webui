import React from 'react';
import { Router, Route, Link } from 'react-router';
import AuthenticatedApp from './components/AuthenticatedApp'
import Login from './components/Login';
import Home from './components/Home';
import Queue from './components/Queue';
import Search from './components/Search';
//import RouterContainer from './services/RouterContainer';
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions';

import jQuery from 'jquery'

// the histories are imported separately for smaller builds
//import { history } from 'react-router/lib/HashHistory';

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
	    transition('/login', null, { nextPath: nextState.location.pathname });
	}
}

React.render((
  <Router history={ Router.BrowserHistory }>
  	<Route path="login" component={Login}/>
    <Route component={AuthenticatedApp} onEnter={requireAuth}>
	    <Route path="queue" component={Queue}/>
	    <Route path="search" component={Search}/>
	    <Route path="/" component={Home}/>
	</Route>
  </Router>
), document.getElementById('content'));


//router.run(function (Handler) {
 // React.render(router, document.getElementById('content'));
//});

