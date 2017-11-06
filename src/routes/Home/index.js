import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/',
  exact: true,
  component: AsyncComponentDecorator(() => System.import('./components/Home')),
  childRoutes: {
    path: '/widget', 
    component: AsyncComponentDecorator(() => System.import('./components/WidgetDialog')),
  }
};