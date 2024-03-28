import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import { BuildClearChatAction } from '../decorators/ChatActionDecorator';
import { BuildRemoveSessionAction } from '../decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

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

export const HubReconnectAction = {
  id: 'reconnect',
  displayName: 'Reconnect',
  access: API.AccessEnum.HUBS_EDIT,
  icon: IconConstants.REFRESH_COLORED,
  handler: handleReconnect,
};

export const HubFavoriteAction = {
  id: 'favorite',
  displayName: 'Add to favorites',
  access: API.AccessEnum.HUBS_EDIT,
  icon: IconConstants.FAVORITE,
  filter: showFav,
  handler: handleFavorite,
  notifications: {
    onSuccess: 'The hub {{item.identity.name}} was added in favorites',
  },
};

export const HubToggleChatNotifyAction = {
  id: 'toggleChatNotify',
  displayName: 'Use chat notification',
  access: API.AccessEnum.HUBS_EDIT,
  handler: handleToggleChatNotify,
  checked: (hub: API.Hub) => {
    return hub.settings.use_main_chat_notify;
  },
};

export const HubToggleShowJoinsAction = {
  id: 'toggleShowJoins',
  displayName: 'Show joins/parts',
  access: API.AccessEnum.HUBS_EDIT,
  handler: handleToggleJoins,
  checked: (hub: API.Hub) => {
    return hub.settings.show_joins;
  },
};

const HubClearChatAction = BuildClearChatAction(
  HubConstants.SESSIONS_URL,
  API.AccessEnum.HUBS_EDIT,
);

const HubRemoveAction = BuildRemoveSessionAction(
  HubConstants.SESSIONS_URL,
  API.AccessEnum.HUBS_EDIT,
);

const HubActions: UI.ActionListType<API.Hub> = {
  reconnect: HubReconnectAction,
  favorite: HubFavoriteAction,
  toggleChatNotify: HubToggleChatNotifyAction,
  toggleShowJoins: HubToggleShowJoinsAction,
  clearChat: HubClearChatAction,
  divider: MENU_DIVIDER,
  remove: HubRemoveAction,
};

export const HubActionModule = {
  moduleId: UI.Modules.HUBS,
};

export const HubActionMenu = {
  moduleData: HubActionModule,
  actions: HubActions,
};
