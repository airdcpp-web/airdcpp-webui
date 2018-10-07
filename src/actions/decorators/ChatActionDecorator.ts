'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';


type SessionType = UI.SessionItemBase;

export default function (actions: UI.ActionType[], sessionUrl: string, editAccess: API.AccessEnum) {
  const ChatActions = Reflux.createActions([
    { 'fetchMessages': { asyncResult: true } },
    { 'sendMessage': { asyncResult: true } },
    { 'setRead': { asyncResult: true } },
    { 'clear': { 
      asyncResult: true ,
      displayName: 'Clear chat',
      access: editAccess,
      icon: IconConstants.CLEAR },
    },
    'activeChatChanged',
    'divider'
  ]);

  ChatActions.fetchMessages.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType
  ) {
    let that = this;
    SocketService.get(`${sessionUrl}/${session.id}/messages/0`)
      .then(that.completed.bind(that, session.id))
      .catch(that.failed.bind(that, session.id));
  });

  ChatActions.fetchMessages.failed.listen(function (session: SessionType, error: ErrorResponse) {
    NotificationActions.apiError('Failed to fetch chat messages', error, session.id);
  });

  ChatActions.setRead.listen(function (
    this: UI.AsyncActionType<API.IdType>, 
    session: SessionType
  ) {
    let that = this;
    SocketService.post(`${sessionUrl}/${session.id}/messages/read`)
      .then(that.completed)
      .catch(that.failed);
  });

  ChatActions.clear.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType
  ) {
    let that = this;
    SocketService.delete(`${sessionUrl}/${session.id}/messages`)
      .then(that.completed.bind(that, session))
      .catch(that.failed.bind(that, session));
  });

  ChatActions.clear.failed.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType, 
    error: ErrorResponse
  ) {
    NotificationActions.apiError('Failed to clear chat messages', error, session.id);
  });


  ChatActions.sendMessage.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType, 
    text: string, 
    thirdPerson = false
  ) {
    let that = this;
    SocketService.post(`${sessionUrl}/${session.id}/chat_message`, { 
      text,
      third_person: thirdPerson,
    })
      .then(that.completed.bind(that, session))
      .catch(that.failed.bind(that, session));
  });

  ChatActions.sendMessage.failed.listen(function (session: SessionType, error: ErrorResponse) {
    NotificationActions.apiError('Failed to send chat message', error, session.id);
  });

  return Object.assign(actions, ChatActions);
}