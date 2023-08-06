//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (
  actions: UI.RefluxActionConfigList<SessionType>[],
  sessionUrl: string,
) {
  const ChatActionConfig: UI.RefluxActionConfigList<SessionType> = [
    { fetchMessages: { asyncResult: true } },
    { sendChatMessage: { asyncResult: true } },
    { sendStatusMessage: { asyncResult: true } },
    { setRead: { asyncResult: true } },
    'activeChatChanged',
    'divider',
  ];

  const ChatActions = Reflux.createActions(ChatActionConfig);

  ChatActions.fetchMessages.listen(function (
    this: UI.AsyncActionType<SessionType>,
    session: SessionType,
  ) {
    const that = this;
    SocketService.get(`${sessionUrl}/${session.id}/messages/0`)
      .then(that.completed.bind(that, session))
      .catch(that.failed.bind(that, session));
  });

  ChatActions.fetchMessages.failed.listen(function (
    session: SessionType,
    error: ErrorResponse,
  ) {
    NotificationActions.apiError('Failed to fetch chat messages', error, session.id);
  });

  ChatActions.setRead.listen(function (
    this: UI.AsyncActionType<API.IdType>,
    session: SessionType,
  ) {
    const that = this;
    SocketService.post(`${sessionUrl}/${session.id}/messages/read`)
      .then(that.completed)
      .catch(that.failed);
  });

  ChatActions.sendChatMessage.listen(function (
    this: UI.AsyncActionType<SessionType>,
    session: SessionType,
    text: string,
    thirdPerson = false,
  ) {
    const that = this;
    SocketService.post(`${sessionUrl}/${session.id}/chat_message`, {
      text,
      third_person: thirdPerson,
    })
      .then(that.completed.bind(that, session))
      .catch(that.failed.bind(that, session));
  });

  ChatActions.sendChatMessage.failed.listen(function (
    session: SessionType,
    error: ErrorResponse,
  ) {
    NotificationActions.apiError('Failed to send chat message', error, session.id);
  });

  ChatActions.sendStatusMessage.listen(function (
    this: UI.AsyncActionType<SessionType>,
    session: SessionType,
    message: API.OutgoingChatStatusMessage,
  ) {
    const that = this;
    SocketService.post(`${sessionUrl}/${session.id}/status_message`, message)
      .then(that.completed.bind(that, session))
      .catch(that.failed.bind(that, session));
  });

  ChatActions.sendStatusMessage.failed.listen(function (
    session: SessionType,
    error: ErrorResponse,
  ) {
    NotificationActions.apiError('Failed to send status message', error, session.id);
  });

  return Object.assign(actions, ChatActions);
}
