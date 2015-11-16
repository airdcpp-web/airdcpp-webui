module.exports = {
	path: 'speed-limits',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'speed', 
				component: require('./components/SpeedPage'), 
			}, {
				path: 'download-limits', 
				component: require('./components/DownloadLimitPage'), 
			}, {
				path: 'upload-limits', 
				component: require('./components/UploadLimitPage'), 
			}, {
				path: 'user-limits', 
				component: require('./components/UserLimitPage'), 
			} ]);
		}, 'settings-speed-limits-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/SpeedLimits'));
		}, 'settings-speed-limits');
	}
};

