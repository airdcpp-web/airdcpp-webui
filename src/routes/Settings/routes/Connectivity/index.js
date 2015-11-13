module.exports = {
	path: 'connectivity',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'detection', 
				component: require('./components/DetectionPage'), 
			}, {
				path: 'v4', 
				component: require('./components/IPv4Page'), 
			}, {
				path: 'v6', 
				component: require('./components/IPv6Page'), 
			}, {
				path: 'ports', 
				component: require('./components/PortsPage'), 
			} ]);
		}, 'settings-connectivity-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Connectivity'));
		}, 'settings-connectivity');
	}
};

