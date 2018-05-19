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

