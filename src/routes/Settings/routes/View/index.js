module.exports = {
	path: 'view',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'histories', 
				component: require('./components/HistoryPage').default, 
			}, {
				path: 'events', 
				component: require('./components/EventPage').default, 
			} ]);
		}, 'settings-view-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-view');
	}
};

