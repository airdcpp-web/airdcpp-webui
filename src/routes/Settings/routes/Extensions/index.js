module.exports = {
	path: 'extensions',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'packages', 
				component: require('./components/ExtensionsBrowsePage').default,
			}, {
				path: 'manage', 
				component: require('./components/ExtensionsManagePage').default,
			} ]);
		}, 'settings-extensions-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-extensions');
	}
};

