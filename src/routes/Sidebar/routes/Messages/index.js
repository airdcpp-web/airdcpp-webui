module.exports = {
  path: '/messages',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'session/:id', 
        component: require('./components/PrivateChatSession').default, 
      }, {
        path: 'new', 
        component: require('./components/MessageNew').default,
      } ]);
    }, 'messages-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Messages').default);
    }, 'messages');
  }
};

