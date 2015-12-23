module.exports = {
	path: 'speed-limits',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'speed', 
				component: require('./components/SpeedPage').default, 
			}, {
				path: 'download-limits', 
				component: require('./components/DownloadLimitPage').default, 
			}, {
				path: 'upload-limits', 
				component: require('./components/UploadLimitPage').default, 
			}, {
				path: 'user-limits', 
				component: require('./components/UserLimitPage').default, 
			}, {
				path: 'limiter', 
				component: require('./components/LimiterPage').default, 
			} ]);
		}, 'settings-speed-limits-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('../../components/SettingSection').default);
		}, 'settings-speed-limits');
	}
};

