import PrivateChatConstants from '@/constants/PrivateChatConstants';

import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

type Filter = UI.ActionFilter<API.PrivateChat>;
const ccpmConnected: Filter = ({ itemData }) =>
  itemData.ccpm_state.id === API.CCPMStateEnum.CONNECTED;
const ccpmDisconnected: Filter = ({ itemData }) =>
  itemData.ccpm_state.id === API.CCPMStateEnum.DISCONNECTED;

type Handler = UI.ActionHandler<API.PrivateChat>;

const handleConnectCCPM: Handler = ({ itemData: session, socket }) => {
  return socket.post(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`);
};

const handleDisconnectCCPM: Handler = ({ itemData: session, socket }) => {
  return socket.delete(`${PrivateChatConstants.SESSIONS_URL}/${session.id}/ccpm`);
};

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

const PrivateChatActions: UI.ActionListType<API.PrivateChat> = {
  connectCCPM: PrivateChatConnectCCPMAction,
  disconnectCCPM: PrivateChatDisconnectCCPMAction,
};

export const PrivateChatCCPMActionModule = {
  moduleId: UI.Modules.MESSAGES,
};

export const PrivateChatCCPMActionMenu = {
  moduleData: PrivateChatCCPMActionModule,
  actions: PrivateChatActions,
};
