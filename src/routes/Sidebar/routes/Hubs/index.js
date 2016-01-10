module.exports = {
	path: '/hubs',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/HubSession').default,
			}, {
				path: 'new', 
				component: require('./components/HubNew').default,
			} ]);
		}, 'hubs-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Hubs').default);
		}, 'hubs');
	}
};

