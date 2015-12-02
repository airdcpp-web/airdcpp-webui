module.exports = {
	path: 'filelists',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/FilelistSession'), 
				childRoutes: [
					{
						path: 'download', 
						component: require('components/DownloadDialog'), 
					}
				]
			}, {
				path: 'new', 
				component: require('./components/FilelistNew'),
			} ]);
		}, 'filelists-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Filelists'));
		}, 'filelists');
	}
};

