module.exports = {
  path: 'profile',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'user', 
        component: require('./components/UserPage').default, 
      }, {
        path: 'away', 
        component: require('./components/AwayPage').default, 
      }, {
        path: 'ignored-users', 
        component: require('./components/IgnorePage').default, 
      }, {
        path: 'miscellaneous', 
        component: require('./components/MiscPage').default, 
      } ]);
    }, 'settings-profile-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/SettingSection').default);
    }, 'settings-profile');
  },
};

