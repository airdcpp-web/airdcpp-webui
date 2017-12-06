import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';

export default {
  path: '/events',
  component: AsyncComponentDecorator(() => System.import(/* webpackChunkName: "system-log" */ 'routes/Sidebar/routes/Events/components/SystemLog')),
};


