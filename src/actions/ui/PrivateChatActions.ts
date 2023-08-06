import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

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

const PrivateChatActions: UI.ActionListType<API.PrivateChat> = {
  connectCCPM: {
    displayName: 'Connect',
    access: API.AccessEnum.PRIVATE_CHAT_EDIT,
    icon: IconConstants.PLAY,
    handler: handleConnectCCPM,
    filter: ccpmDisconnected,
  },
  disconnectCCPM: {
    access: API.AccessEnum.PRIVATE_CHAT_EDIT,
    displayName: 'Disconnect',
    icon: IconConstants.REMOVE,
    handler: handleDisconnectCCPM,
    filter: ccpmConnected,
  },
};

const PrivateChatActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    PrivateChatActions,
    PrivateChatConstants.SESSIONS_URL,
    API.AccessEnum.PRIVATE_CHAT_EDIT,
  ),
  PrivateChatConstants.SESSIONS_URL,
  API.AccessEnum.PRIVATE_CHAT_EDIT,
);

export default {
  moduleId: UI.Modules.MESSAGES,
  actions: PrivateChatActionsDecorated,
};
