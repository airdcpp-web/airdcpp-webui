module.exports = {
  path: 'system',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'users', 
        component: require('./components/WebUsersPage').default,
        childRoutes: [
          {
            path: 'user', 
            component: require('./components/users/WebUserDialog').default, 
          }
        ]
      }, {
        path: 'logging', 
        component: require('./components/LoggingPage').default,
      }, {
        path: 'server-settings', 
        component: require('./components/ServerSettingsPage').default,
      } ]);
    }, 'settings-system-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/SettingSection').default);
    }, 'settings-system');
  }
};

