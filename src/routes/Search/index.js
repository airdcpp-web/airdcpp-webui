module.exports = {
	path: 'search',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'download', 
				component: require('components/download/DownloadDialog').default, 
			} ]);
		}, 'search-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Search').default);
		}, 'search');
	}
};

