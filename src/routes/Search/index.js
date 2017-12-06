import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/search',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "search" */ './components/Search')),
};