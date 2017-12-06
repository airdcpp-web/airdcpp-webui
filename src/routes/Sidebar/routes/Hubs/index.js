import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/hubs/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "hubs" */ 'routes/Sidebar/routes/Hubs/components/Hubs')),
};

