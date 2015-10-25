module.exports = {
	path: 'messages',
	
	getChildRoutes (location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/PrivateChatSession'), 
			}])
		}, "messages-children")
	},

	getComponent (location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Messages'))
		}, "messages")
	}
}

