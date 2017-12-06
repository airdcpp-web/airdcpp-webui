import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/favorite-hubs',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "favorite-hubs" */ './components/FavoriteHubs')),
};