import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';

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

const HubSettingActions: UI.ActionListType<API.Hub> = {
  toggleChatNotify: HubToggleChatNotifyAction,
  toggleShowJoins: HubToggleShowJoinsAction,
};

export const HubSettingActionModule = {
  moduleId: UI.Modules.HUBS,
};

export const HubSettingActionMenu = {
  moduleData: HubSettingActionModule,
  actions: HubSettingActions,
};
