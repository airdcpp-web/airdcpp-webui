import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/filelists/:session?/:id?',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "filelists" */ 'routes/Sidebar/routes/Filelists/components/Filelists')),
};

