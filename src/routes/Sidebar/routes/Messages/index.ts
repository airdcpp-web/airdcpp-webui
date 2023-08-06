import IconConstants from 'constants/IconConstants';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import * as API from 'types/api';
import * as UI from 'types/ui';

export const MessageRoutes: UI.RouteItem = {
  title: 'Messages',
  path: '/messages',
  matchPath: '/messages/:session?/:id?',
  icon: IconConstants.MESSAGES_COLORED,
  unreadInfoStore: PrivateChatSessionStore,
  access: API.AccessEnum.PRIVATE_CHAT_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "messages" */ './components'
    );
    return {
      Component,
    };
  },
};
