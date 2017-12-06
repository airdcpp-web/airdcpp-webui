import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/login',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "login" */ './components/Login')),
};

