module.exports = {
	path: 'about',

	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'application', 
				component: require('./components/AboutPage').default, 
			}, {
				path: 'transfers', 
				component: require('./components/TransferStatisticsPage').default, 
			}, {
				path: 'share', 
				component: require('./components/ShareStatisticsPage').default, 
			}, {
				path: 'hubs', 
				component: require('./components/HubStatisticsPage').default, 
			} ]);
		}, 'settings-about-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-about');
	}
};

