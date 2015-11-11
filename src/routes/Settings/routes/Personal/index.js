module.exports = {
	path: 'personal',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'profile', 
				component: require('./components/UserProfile'), 
			} ]);
		}, 'setting-personal-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Personal'));
		}, 'settings-personal');
	}
};

