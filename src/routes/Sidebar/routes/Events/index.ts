import IconConstants from 'constants/IconConstants';
import EventStore from 'stores/EventStore';
import * as API from 'types/api';
import * as UI from 'types/ui';

export const EventRoutes: UI.RouteItem = {
  title: 'Events',
  path: '/events',
  icon: IconConstants.EVENTS_COLORED,
  unreadInfoStore: EventStore,
  access: API.AccessEnum.EVENTS_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "system-log" */ './components'
    );
    return {
      Component,
    };
  },
};
