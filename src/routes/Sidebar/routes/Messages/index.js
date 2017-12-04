import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/messages/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import('./components/Messages')),
  childRoutes: [
    {
      path: '/messages/session/:id',
      component: AsyncComponentDecorator(() => System.import('./components/PrivateChatSession')),
    }, {
      path: '/messages/new',
      component: AsyncComponentDecorator(() => System.import('./components/MessageNew')),
    }
  ]
};

