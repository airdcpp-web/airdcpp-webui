import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/messages/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "messages" */ 'routes/Sidebar/routes/Messages/components/Messages')),
};

