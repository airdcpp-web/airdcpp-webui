import History from 'utils/History'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

module.exports = {
  path: 'sidebar',

  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/Filelists'), 
      ])
    }, "sidebar-children")
  },

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Sidebar'))
    }, "sidebar")
  }
}

