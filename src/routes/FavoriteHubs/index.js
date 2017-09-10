module.exports = {
  path: 'favorite-hubs',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'edit', 
        component: require('./components/FavoriteHubDialog').default, 
      },{
        path: 'new', 
        component: require('./components/FavoriteHubDialog').default, 
      } ]);
    }, 'favorite-hubs-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/FavoriteHubs').default);
    }, 'favorite-hubs');
  }
};

