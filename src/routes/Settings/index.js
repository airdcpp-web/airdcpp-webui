import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/settings',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "settings" */ './components/Settings')),
};

