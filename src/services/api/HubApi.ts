import HubConstants from '@/constants/HubConstants';
import SocketService from '@/services/SocketService';

import * as API from '@/types/api';
import { clearMessagesDecorator } from './common/ChatActions';

//import * as UI from '@/types/ui';

export const sendHubPassword = (hub: API.Hub, password: string) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/password`, {
    password: password,
  });
};

export const acceptHubRedirect = (hub: API.Hub) => {
  return SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/redirect`);
};

export const clearHubChatMessages = clearMessagesDecorator(HubConstants.SESSIONS_URL);

//export const sendHubChatMessage = sendChatMessageDecorator(HubConstants.SESSIONS_URL);
//export const fetchHubChatMessages = fetchMessagesDecorator(HubConstants.SESSIONS_URL);

//export const setHubSessionRead = setReadDecorator(HubConstants.SESSIONS_URL);
