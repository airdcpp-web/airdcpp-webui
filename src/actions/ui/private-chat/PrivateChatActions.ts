import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { BuildRemoveSessionAction } from '../decorators/SessionActionDecorator';
import { BuildClearChatAction } from '../decorators/ChatActionDecorator';

const handleConnectCCPM: UI.ActionHandler<API.PrivateChat> = ({ data: session }) => {
  return SocketService.post(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`);
};

const handleDisconnectCCPM: UI.ActionHandler<API.PrivateChat> = ({ data: session }) => {
  return SocketService.delete(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`);
};

const ccpmConnected = (data: API.PrivateChat) =>
  data.ccpm_state.id === API.CCPMStateEnum.CONNECTED;
const ccpmDisconnected = (data: API.PrivateChat) =>
  data.ccpm_state.id === API.CCPMStateEnum.DISCONNECTED;

export const PrivateChatConnectCCPMAction = {
  id: 'connectCCPM',
  displayName: 'Connect',
  access: API.AccessEnum.PRIVATE_CHAT_EDIT,
  icon: IconConstants.PLAY,
  handler: handleConnectCCPM,
  filter: ccpmDisconnected,
};

export const PrivateChatDisconnectCCPMAction = {
  id: 'disconnectCCPM',
  displayName: 'Disconnect',
  access: API.AccessEnum.PRIVATE_CHAT_EDIT,
  icon: IconConstants.REMOVE,
  handler: handleDisconnectCCPM,
  filter: ccpmConnected,
};

const PrivateChatClearChatAction = BuildClearChatAction(
  PrivateChatConstants.SESSIONS_URL,
  API.AccessEnum.PRIVATE_CHAT_EDIT,
);

const PrivateChatRemoveAction = BuildRemoveSessionAction(
  PrivateChatConstants.SESSIONS_URL,
  API.AccessEnum.PRIVATE_CHAT_EDIT,
);

const PrivateChatActions: UI.ActionListType<API.PrivateChat> = {
  connectCCPM: PrivateChatConnectCCPMAction,
  disconnectCCPM: PrivateChatDisconnectCCPMAction,

  clearChat: PrivateChatClearChatAction,
  remove: PrivateChatRemoveAction,
};

export const PrivateChatActionModule = {
  moduleId: UI.Modules.MESSAGES,
};

export const PrivateChatActionMenu = {
  moduleData: PrivateChatActionModule,
  actions: PrivateChatActions,
};
