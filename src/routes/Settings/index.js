module.exports = {
	path: 'settings',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [
				require('./routes/Profile'),
				require('./routes/Connectivity'),
				require('./routes/SpeedLimits'),
				require('./routes/Downloads'),
				require('./routes/Sharing'),
				require('./routes/View'),
				require('./routes/System'),
				require('./routes/Extensions'),
				require('./routes/About'),
				{
					path: '**/**(/**)/browse',
					component: require('components/filebrowser/FileBrowserDialog').default,
				}
			]);
		}, 'settings-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Settings').default);
		}, 'settings');
	}
};

