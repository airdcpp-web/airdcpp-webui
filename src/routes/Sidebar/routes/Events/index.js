import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/events',
  component: AsyncComponentDecorator(() => System.import('./components/SystemLog')),
};


