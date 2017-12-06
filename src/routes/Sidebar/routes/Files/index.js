import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/files/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "files" */ 'routes/Sidebar/routes/Files/components/Files')),
};

