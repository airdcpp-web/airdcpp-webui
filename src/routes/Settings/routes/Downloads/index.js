module.exports = {
	path: 'downloads',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'locations', 
				component: require('./components/LocationsPage'), 
			}, {
				path: 'download-options', 
				component: require('./components/DownloadOptionsPage'), 
			}, {
				path: 'skipping-options', 
				component: require('./components/SkippingOptionsPage'), 
			}, {
				path: 'search-matching', 
				component: require('./components/SearchMatchingPage'), 
			} ]);
		}, 'settings-downloads-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Downloads'));
		}, 'settings-downloads');
	}
};

