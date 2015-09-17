module.exports = {
  path: 'favorite-hubs',
  
  getChildRoutes (location, cb) {
    //require.ensure([], (require) => {
      cb(null, [ {
        path: 'edit', 
        component: require('./components/FavoriteHubDialog'), 
      },{
        path: 'new', 
        component: require('./components/FavoriteHubDialog'), 
      } ])
    //})
  },

  getComponent (location, cb) {
    //require.ensure([], (require) => {
      cb(null, require('./components/FavoriteHubs'))
    //})
  }
}

