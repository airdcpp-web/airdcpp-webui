module.exports = {
	path: 'queue',
	
	/*getChildRoutes (location, cb) {
		require.ensure([], (require) => {
			cb(null, [
				require("./routes/Announcements"),
				require("./routes/Assignments"),
				require("./routes/Grades"),
			])
		})
	},*/

	getIndexRoute(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Queue'));
		}, 'queue');
	}
};

