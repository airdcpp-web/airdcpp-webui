module.exports = {
	path: 'connectivity',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'detection', 
				component: require('./components/DetectionPage').default, 
			}, {
				path: 'v4', 
				component: require('./components/IPv4Page').default, 
			}, {
				path: 'v6', 
				component: require('./components/IPv6Page').default, 
			}, {
				path: 'ports', 
				component: require('./components/PortsPage').default, 
			} ]);
		}, 'settings-connectivity-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-connectivity');
	}
};

