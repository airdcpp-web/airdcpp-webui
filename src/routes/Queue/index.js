module.exports = {
	path: 'queue',

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Queue').default);
		}, 'queue');
	}
};

