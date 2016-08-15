module.exports = {
	path: 'home',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'widget', 
				component: require('./components/WidgetDialog').default,
			} ]);
		}, 'home-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Home').default);
		}, 'home');
	}
};

