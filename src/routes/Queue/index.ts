import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const QueueRoutes: UI.RouteItem = {
  title: 'Queue',
  path: '/queue',
  icon: IconConstants.QUEUE_COLORED,
  access: API.AccessEnum.QUEUE_VIEW,
  // lazy: () => import(/* webpackChunkName: "queue" */ './components/Queue'),
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "queue" */ './components'
    );
    return {
      Component,
    };
  },
};
