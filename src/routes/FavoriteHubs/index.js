import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/favorite-hubs',
  component: AsyncComponentDecorator(() => System.import('./components/FavoriteHubs')),
  childRoutes: [
    {
      path: '/favorite-hubs/new',
      component: AsyncComponentDecorator(() => System.import('./components/FavoriteHubDialog')),
    }, {
      path: '/favorite-hubs/edit',
      component: AsyncComponentDecorator(() => System.import('./components/FavoriteHubDialog')),
    }
  ]
};