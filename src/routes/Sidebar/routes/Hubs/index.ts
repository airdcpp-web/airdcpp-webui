import IconConstants from 'constants/IconConstants';
import HubSessionStore from 'stores/HubSessionStore';
import * as API from 'types/api';
import * as UI from 'types/ui';

export const HubRoutes: UI.RouteItem = {
  title: 'Hubs',
  path: '/hubs',
  matchPath: '/hubs/:session?/:id?',
  icon: IconConstants.HUBS_COLORED,
  unreadInfoStore: HubSessionStore,
  access: API.AccessEnum.HUBS_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "hubs" */ './components'
    );
    return {
      Component,
    };
  },
};
