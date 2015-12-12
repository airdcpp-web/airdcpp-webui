module.exports = {
	path: 'sharing',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'directories', 
				component: require('./components/ShareDirectoriesPage').default,
				childRoutes: [
					{
						path: 'root', 
						component: require('./components/ShareDirectoryDialog').default, 
					}
				]
			}, {
				path: 'profiles', 
				component: require('./components/ShareProfilesPage').default,
			}, {
				path: 'hashing', 
				component: require('./components/HashingPage').default, 
			}, {
				path: 'sharing-options', 
				component: require('./components/SharingOptionsPage').default, 
			}, {
				path: 'refresh-options', 
				component: require('./components/RefreshOptionsPage').default, 
			} ]);
		}, 'settings-sharing-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Sharing').default);
		}, 'settings-sharing');
	}
};

