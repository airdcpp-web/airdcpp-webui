module.exports = {
	path: 'sharing',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'directories', 
				component: require('./components/ShareDirectoriesPage'), 
			}, {
				path: 'hashing', 
				component: require('./components/HashingPage'), 
			}, {
				path: 'sharing-options', 
				component: require('./components/SharingOptionsPage'), 
			}, {
				path: 'refresh-options', 
				component: require('./components/RefreshOptionsPage'), 
			} ]);
		}, 'settings-sharing-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Sharing'));
		}, 'settings-sharing');
	}
};

