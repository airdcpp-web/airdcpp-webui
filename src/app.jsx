import React from 'react'
import { Router, Route, Link } from 'react-router'
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions'
import History from './utils/History'

import semantic from './utils/semantic'
import 'style.css'

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
    	path: 'login', 
    	component: require('./components/Login'), 
    }, 
    { 
      component: require('./components/AuthenticatedApp'),
      path: '/',
      onEnter: requireAuth,
      indexRoute: require('./routes/Home'),
      childRoutes: [
        require('./routes/FavoriteHubs'),
        require('./routes/Queue'),
        require('./routes/Search'),
        require('./routes/Sidebar'),
      ]
    }
]

React.render(
  <Router history={ History } routes={routeConfig} />,
  document.getElementById('container-main')
);