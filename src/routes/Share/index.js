import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/share',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "share" */ './components/Share')),
};