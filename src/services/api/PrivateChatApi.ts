import SocketService from '@/services/SocketService';

import * as API from '@/types/api';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import {
  sendChatMessageDecorator,
  clearMessagesDecorator,
  setReadDecorator,
  fetchMessagesDecorator,
} from './common/ChatActions';

export const changePrivateChatHubUrl = (session: API.PrivateChat, hubUrl: string) => {
  return SocketService.patch(PrivateChatConstants.SESSIONS_URL + '/' + session.id, {
    hub_url: hubUrl,
  });
};

export const sendPrivateChatMessage = sendChatMessageDecorator(
  PrivateChatConstants.SESSIONS_URL,
);
export const clearPrivateChatMessages = clearMessagesDecorator(
  PrivateChatConstants.SESSIONS_URL,
);
export const fetchPrivateChatMessages = fetchMessagesDecorator(
  PrivateChatConstants.SESSIONS_URL,
);

export const setPrivateChatSessionRead = setReadDecorator(
  PrivateChatConstants.SESSIONS_URL,
);
