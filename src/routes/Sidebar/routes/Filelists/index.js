/*module.exports = {
  path: '/filelists',
	
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [ {
        path: 'session/:id', 
        component: require('./components/FilelistSession').default, 
        childRoutes: [
          {
            path: 'download', 
            component: require('components/download/DownloadDialog').default, 
          }
        ]
      }, {
        path: 'new', 
        component: require('./components/FilelistNew').default,
      } ]);
    }, 'filelists-children');
  },

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Filelists').default);
    }, 'filelists');
  }
};*/

import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/filelists/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import('./components/Filelists')),
  childRoutes: [
    {
      path: '/filelists/session/:id',
      component: AsyncComponentDecorator(() => System.import('./components/FilelistSession')),
    }, {
      path: '/filelists/new',
      component: AsyncComponentDecorator(() => System.import('./components/FilelistNew')),
    }
  ]
};

