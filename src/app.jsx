import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import LoginStore from 'stores/LoginStore';
import LoginActions from 'actions/LoginActions';
import History from 'utils/History';

import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import find from 'array.prototype.find';
import semantic from './utils/semantic';

import 'style.css';

Reflux.use(RefluxPromise(Promise));

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
			require('./routes/Settings'),
			require('./routes/Sidebar'),
		]
	}
];

ReactDOM.render(
	<Router history={ History } routes={routeConfig} />,
	document.getElementById('container-main')
);
