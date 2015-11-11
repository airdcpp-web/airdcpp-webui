module.exports = {
	path: 'settings',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [
				require('./routes/Personal'),
				//require('./routes/Connection'),
				//require('./routes/Sharing'),
			]);
		});
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Settings'));
		}, 'settings');
	}
};

