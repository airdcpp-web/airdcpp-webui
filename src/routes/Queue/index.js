import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/queue',
  component: AsyncComponentDecorator(() => System.import('./components/Queue')),
  childRoutes: [
    {
      path: '/queue/sources',
      component: AsyncComponentDecorator(() => System.import('./components/SourceDialog')),
    }, {
      path: '/queue/content',
      component: AsyncComponentDecorator(() => System.import('./components/BundleFileDialog')),
    }
  ]
};
