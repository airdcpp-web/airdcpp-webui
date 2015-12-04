import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import LoginStore from 'stores/LoginStore';
import LoginActions from 'actions/LoginActions';
import History from 'utils/History';

import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import { SIDEBAR_ID } from 'constants/OverlayConstants';

import 'array.prototype.find';
import './utils/semantic';

import 'style.css';

Reflux.use(RefluxPromise(Promise));

if (LoginStore.token) {
	LoginActions.connect(LoginStore.token);
}

const requireAuth = (nextState, replaceState) => {
	if (!LoginStore.user) {
		replaceState({ nextPath: nextState.location.pathname }, '/login', null);
	}
};

const onEnterSidebar = (nextProps, replaceState) => {
	// Don't allow sidebar to be accessed with a direct link
	if (!nextProps.location.state || !nextProps.location.state[SIDEBAR_ID]) {
		replaceState(null, '/');
	}
};

const routeConfig = [
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
			{ 
				component: require('./routes/Sidebar/components/Sidebar'),
				path: 'sidebar',
				onEnter: onEnterSidebar,
				childRoutes: [
					require('./routes/Sidebar/routes/Hubs'),
					require('./routes/Sidebar/routes/Filelists'), 
					require('./routes/Sidebar/routes/Messages'), 
					require('./routes/Sidebar/routes/Events'), 
				]
			}
		]
	}
];

ReactDOM.render(
	<Router history={ History } routes={routeConfig} />,
	document.getElementById('container-main')
);
