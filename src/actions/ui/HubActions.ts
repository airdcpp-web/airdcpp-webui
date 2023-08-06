import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const showFav = (hub: API.Hub) => !hub.favorite_hub;

const handleFavorite: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/favorite`);
};

const handleToggleChatNotify: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.patch(`${HubConstants.SESSIONS_URL}/${hub.id}`, {
    use_main_chat_notify: !hub.settings.use_main_chat_notify,
  });
};

const handleToggleJoins: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.patch(`${HubConstants.SESSIONS_URL}/${hub.id}`, {
    show_joins: !hub.settings.show_joins,
  });
};

const handleReconnect: UI.ActionHandler<API.Hub> = ({ data: hub }) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/reconnect`);
};

const HubActions: UI.ActionListType<API.Hub> = {
  reconnect: {
    displayName: 'Reconnect',
    access: API.AccessEnum.HUBS_EDIT,
    icon: IconConstants.REFRESH_COLORED,
    handler: handleReconnect,
  },
  favorite: {
    access: API.AccessEnum.HUBS_EDIT,
    displayName: 'Add to favorites',
    icon: IconConstants.FAVORITE,
    filter: showFav,
    handler: handleFavorite,
    notifications: {
      onSuccess: 'The hub {{item.identity.name}} was added in favorites',
    },
  },
  toggleChatNotify: {
    access: API.AccessEnum.HUBS_EDIT,
    displayName: 'Use chat notification',
    handler: handleToggleChatNotify,
    checked: (hub) => {
      return hub.settings.use_main_chat_notify;
    },
  },
  toggleShowJoins: {
    access: API.AccessEnum.HUBS_EDIT,
    displayName: 'Show joins/parts',
    handler: handleToggleJoins,
    checked: (hub) => {
      return hub.settings.show_joins;
    },
  },
};

const HubActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(HubActions, HubConstants.SESSIONS_URL, API.AccessEnum.HUBS_EDIT),
  HubConstants.SESSIONS_URL,
  API.AccessEnum.HUBS_EDIT,
);

export default {
  moduleId: UI.Modules.HUBS,
  actions: HubActionsDecorated,
};
