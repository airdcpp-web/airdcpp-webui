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

