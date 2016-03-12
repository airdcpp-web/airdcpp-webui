module.exports = {
	path: 'share',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'edit', 
				component: require('./components/ShareDirectoryDialog').default, 
			}, {
				path: 'add', 
				component: require('./components/ShareDirectoryDialog').default, 
			}, {
				path: '**/browse',
				component: require('components/filebrowser/FileBrowserDialog').default,
			} ]);
		}, 'share-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/ShareDirectoryLayout').default);
		}, 'share');
	}
};

