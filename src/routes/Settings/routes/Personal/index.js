module.exports = {
	path: 'personal',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'profile', 
				component: require('./components/UserProfilePage').default, 
			} ]);
		}, 'settings-personal-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-personal');
	},
};

