import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/queue',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "queue" */ './components/Queue')),
};
