import HubConstants from '@/constants/HubConstants';

import * as API from '@/types/api';
import { clearMessagesDecorator } from './common/ChatActions';
import { APISocket } from '../SocketService';

export const sendHubPassword = (hub: API.Hub, password: string, socket: APISocket) => {
  return socket.post(`${HubConstants.SESSIONS_URL}/${hub.id}/password`, {
    password: password,
  });
};

export const acceptHubRedirect = (hub: API.Hub, socket: APISocket) => {
  return socket.post(`${HubConstants.SESSIONS_URL}/${hub.id}/redirect`);
};

export const clearHubChatMessages = clearMessagesDecorator(HubConstants.SESSIONS_URL);
