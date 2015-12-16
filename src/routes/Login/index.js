module.exports = {
	path: 'login',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Login').default);
		}, 'login');
	}
};

