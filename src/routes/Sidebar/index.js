import History from 'utils/History'
import { SIDEBAR_ID } from 'constants/OverlayConstants'

module.exports = {
  path: 'sidebar',

  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
		    require('./routes/Hubs'),
        require('./routes/Filelists'), 
		    require('./routes/Messages'), 
        require('./routes/Events'), 
      ])
    }, "sidebar-children")
  },

  onEnter(nextProps, replaceState) {
    // Don't allow sidebar to be accessed with a direct link
    if (!nextProps.location.state || !nextProps.location.state[SIDEBAR_ID]) {
      replaceState(null,"/");
    }
  },

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Sidebar'))
    }, "sidebar")
  }
}

