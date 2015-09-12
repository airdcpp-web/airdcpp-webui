module.exports = {
  path: 'settings',
  
  /*getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades'),
      ])
    })
  },*/

  getComponent (location, cb) {
    //require.ensure([], (require) => {
      cb(null, require('./components/Settings'))
    //})
  }
}

