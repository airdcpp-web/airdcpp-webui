module.exports = {
  path: 'sharing',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'profiles', 
        component: require('./components/ShareProfilesPage').default,
      }, {
        path: 'hashing', 
        component: require('./components/HashingPage').default, 
      }, {
        path: 'sharing-options', 
        component: require('./components/SharingOptionsPage').default, 
      }, {
        path: 'refresh-options', 
        component: require('./components/RefreshOptionsPage').default, 
      }, {
        path: 'excludes', 
        component: require('./components/ExcludePage').default, 
      } ]);
    }, 'settings-sharing-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/SettingSection').default);
    }, 'settings-sharing');
  }
};

