module.exports = {
  path: 'filelists',
  
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'session/:id', 
        component: require('./components/FilelistSession'), 
      }])
    }, "filelists-children")
  },

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Filelists'))
    }, "filelists")
  }
}

