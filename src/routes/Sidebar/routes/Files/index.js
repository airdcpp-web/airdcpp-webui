/*module.exports = {
  path: '/files',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'session/:id', 
        component: require('./components/FileSession').default, 
      } ]);
    }, 'file-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Files').default);
    }, 'files');
  }
};*/

import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/files/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import('./components/Files')),
  childRoutes: [
    {
      path: '/files/session/:id',
      component: AsyncComponentDecorator(() => System.import('./components/FileSession')),
    }
  ]
};

