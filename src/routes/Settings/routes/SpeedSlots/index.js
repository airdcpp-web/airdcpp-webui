module.exports = {
	path: 'speed-slots',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'speed', 
				component: require('./components/SpeedPage'), 
			} ]);
		}, 'setting-speed-slots-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/SpeedSlots'));
		}, 'settings-speed-slots');
	}
};

