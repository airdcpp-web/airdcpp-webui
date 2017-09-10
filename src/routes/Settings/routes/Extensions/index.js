module.exports = {
  path: 'extensions',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'packages', 
        component: require('./components/ExtensionsBrowsePage').default,
        childRoutes: [
          {
            path: ':id/configure', 
            component: require('./components/ExtensionsConfigureDialog').default, 
          }
        ]
      }, {
        path: 'manage', 
        component: require('./components/ExtensionsManagePage').default,
        childRoutes: [
          {
            path: ':id/configure', 
            component: require('./components/ExtensionsConfigureDialog').default, 
          }
        ]
      }, {
        path: 'extension-options', 
        component: require('./components/ExtensionsOptionsPage').default
      } ]);
    }, 'settings-extensions-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/SettingSection').default);
    }, 'settings-extensions');
  }
};

