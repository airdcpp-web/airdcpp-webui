import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/transfers',
  component: AsyncComponentDecorator(() => System.import('./components/Transfers')),
};
