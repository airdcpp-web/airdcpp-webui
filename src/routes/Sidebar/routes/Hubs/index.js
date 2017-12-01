import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/hubs',
  component: AsyncComponentDecorator(() => System.import('./components/Hubs')),
  childRoutes: [
    {
      path: '/hubs/session/:id',
      component: AsyncComponentDecorator(() => System.import('./components/HubSession')),
    }, {
      path: '/hubs/new',
      component: AsyncComponentDecorator(() => System.import('./components/HubNew')),
    }
  ]
};

