module.exports = {
	path: 'about',

	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'application', 
				component: require('./components/AboutPage'), 
			}, {
				path: 'transfers', 
				component: require('./components/TransferStatisticsPage'), 
			}, {
				path: 'share', 
				component: require('./components/ShareStatisticsPage'), 
			}, {
				path: 'hubs', 
				component: require('./components/HubStatisticsPage'), 
			} ]);
		}, 'settings-about-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/About'));
		}, 'settings-about');
	}
};

