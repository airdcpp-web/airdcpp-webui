module.exports = {
	path: 'downloads',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'locations', 
				component: require('./components/LocationsPage').default, 
			}, {
				path: 'download-options', 
				component: require('./components/DownloadOptionsPage').default, 
			}, {
				path: 'skipping-options', 
				component: require('./components/SkippingOptionsPage').default, 
			}, {
				path: 'search-matching', 
				component: require('./components/SearchMatchingPage').default, 
			} ]);
		}, 'settings-downloads-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Downloads').default);
		}, 'settings-downloads');
	}
};

