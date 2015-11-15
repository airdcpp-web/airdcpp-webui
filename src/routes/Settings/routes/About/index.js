module.exports = {
	path: 'about',

	/*getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [
				require('./routes/Hubs'),
				require('./routes/Filelists'), 
				require('./routes/Messages'), 
				require('./routes/Events'), 
			]);
		}, 'sidebar-children');
	},*/

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/AboutPage'));
		}, 'settings-about');
	}
};

