module.exports = {
	path: '/filelists',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/FilelistSession').default, 
				childRoutes: [
					{
						path: 'download', 
						component: require('components/download/DownloadDialog').default, 
					}
				]
			}, {
				path: 'new', 
				component: require('./components/FilelistNew').default,
			} ]);
		}, 'filelists-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Filelists').default);
		}, 'filelists');
	}
};

