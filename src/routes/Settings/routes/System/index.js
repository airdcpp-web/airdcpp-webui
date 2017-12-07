module.exports = {
  path: 'system',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'users', 
        childRoutes: [
          {
            path: 'user', 
            component: require('./components/users/WebUserDialog').default, 
          }
        ]
      }, {
        path: 'logging', 
      }, {
        path: 'server-settings', 
      } ]);
    }, 'settings-system-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/SettingSection').default);
    }, 'settings-system');
  }
};

const AccessConstants = require('constants/AccessConstants').default;

module.exports = {
  url: 'system',
  title: 'System',
  icon: 'settings',
  access: AccessConstants.ADMIN,
  component: require('../../components/SettingSection').default,
  menuItems: [
    { 
      title: 'Users', 
      url: 'users', 
      noSave: true, 
      fullWidth: true,
      component: require('./components/WebUsersPage').default,
    }, { 
      title: 'Logging', 
      url: 'logging',
      component: require('./components/LoggingPage').default,
    }, { 
      title: 'Web server', 
      url: 'server-settings',
      component: require('./components/ServerSettingsPage').default,
    },
  ],
};

