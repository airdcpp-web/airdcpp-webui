module.exports = {
	path: '/files',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/FileSession').default, 
			} ]);
		}, 'file-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Files').default);
		}, 'files');
	}
};

