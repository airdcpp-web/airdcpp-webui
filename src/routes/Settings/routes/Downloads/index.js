module.exports = {
	path: 'downloads',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'locations', 
				component: require('./components/LocationsPage'), 
			} ]);
		}, 'settings-downloads-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Downloads'));
		}, 'settings-downloads');
	}
};

