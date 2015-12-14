module.exports = {
	path: 'view',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'histories', 
				component: require('./components/Histories').default, 
			} ]);
		}, 'settings-view-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/View').default);
		}, 'settings-view');
	}
};

