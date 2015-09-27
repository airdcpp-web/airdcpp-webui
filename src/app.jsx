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
  <Router history={ History } routes={routeConfig} />,
  document.getElementById('content')
);
