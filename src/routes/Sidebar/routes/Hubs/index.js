module.exports = {
  path: 'hubs',
  
  /*getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'list/:id', 
        component: require('components/Filelist'), 
      }])
    }, "filelists-children")
  },*/

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Hubs'))
    }, "hubs")
  }
}

