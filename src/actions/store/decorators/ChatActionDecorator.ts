import { APISocket } from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (sessionUrl: string) {
  const fetchMessages = async (
    socket: APISocket,
    session: SessionType,
    messageStore: UI.MessageSlice,
  ) => {
    try {
      const messages: UI.MessageListItem[] = await socket.get(
        `${sessionUrl}/${session.id}/messages/0`,
      );
      messageStore.onMessagesFetched(session, messages);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to fetch chat messages', error, session.id);
    }
  };

  const setRead = (session: SessionType, socket: APISocket) => {
    return socket.post(`${sessionUrl}/${session.id}/messages/read`);
  };

  const sendChatMessage = (
    socket: APISocket,
    session: SessionType,
    text: string,
    thirdPerson = false,
  ) => {
    socket
      .post(`${sessionUrl}/${session.id}/chat_message`, {
        text,
        third_person: thirdPerson,
      })
      .catch((e) => {
        const error = e as ErrorResponse;
        NotificationActions.apiError('Failed to send chat message', error, session.id);
      });
  };

  const sendStatusMessage = (
    socket: APISocket,
    session: SessionType,
    message: API.OutgoingChatStatusMessage,
  ) => {
    socket.post(`${sessionUrl}/${session.id}/status_message`, message).catch((e) => {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to send status message', error, session.id);
    });
  };

  return {
    fetchMessages,
    setRead,
    sendChatMessage,
    sendStatusMessage,
  };
}
