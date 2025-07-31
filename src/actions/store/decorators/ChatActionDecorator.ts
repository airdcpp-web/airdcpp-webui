import { APISocket } from '@/services/SocketService';

import NotificationActions from '@/actions/NotificationActions';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (sessionUrl: string) {
  const fetchMessages = async (
    socket: APISocket,
    chatSession: SessionType,
    messageStore: UI.MessageSlice,
  ) => {
    try {
      const messages: UI.MessageListItem[] = await socket.get(
        `${sessionUrl}/${chatSession.id}/messages/0`,
      );
      messageStore.onMessagesFetched(chatSession, messages);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError(
        'Failed to fetch chat messages',
        error,
        chatSession.id,
      );
    }
  };

  const setRead = (chatSession: SessionType, socket: APISocket) => {
    return socket.post(`${sessionUrl}/${chatSession.id}/messages/read`);
  };

  const sendChatMessage = (
    socket: APISocket,
    chatSession: SessionType,
    text: string,
    thirdPerson = false,
  ) => {
    socket
      .post(`${sessionUrl}/${chatSession.id}/chat_message`, {
        text,
        third_person: thirdPerson,
      })
      .catch((e) => {
        const error = e as ErrorResponse;
        NotificationActions.apiError(
          'Failed to send chat message',
          error,
          chatSession.id,
        );
      });
  };

  const sendStatusMessage = (
    socket: APISocket,
    chatSession: SessionType,
    message: API.OutgoingChatStatusMessage,
  ) => {
    socket.post(`${sessionUrl}/${chatSession.id}/status_message`, message).catch((e) => {
      const error = e as ErrorResponse;
      NotificationActions.apiError(
        'Failed to send status message',
        error,
        chatSession.id,
      );
    });
  };

  return {
    fetchMessages,
    setRead,
    sendChatMessage,
    sendStatusMessage,
  };
}
