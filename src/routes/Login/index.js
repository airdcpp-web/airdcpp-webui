import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/login',
  component: AsyncComponentDecorator(() => System.import('./components/Login')),
};

