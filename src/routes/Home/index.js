import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/(home/widget)?',
  exact: true,
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "home" */ './components/Home')),
};