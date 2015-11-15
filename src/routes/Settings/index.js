module.exports = {
	path: 'settings',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [
				require('./routes/Personal'),
				require('./routes/Connectivity'),
				require('./routes/SpeedLimits'),
				//require('./routes/Sharing'),
			]);
		}, 'settings-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Settings'));
		}, 'settings');
	}
};

