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

export default function (actions: UI.ActionType[], sessionsUrl: string, editAccess: API.AccessEnum) {
  const SessionActions = Reflux.createActions([
    { 'fetchSessions': { asyncResult: true } },
    { 'removeSession': { 
      asyncResult: true ,
      displayName: 'Close',
      access: editAccess,
      icon: IconConstants.REMOVE },
    },
    'sessionChanged',
  ] as UI.ActionConfigList<SessionType>);

  SessionActions.fetchSessions.listen(function (this: UI.AsyncActionType<SessionType>) {
    let that = this;
    SocketService.get(sessionsUrl)
      .then(that.completed)
      .catch(that.failed);
  });

  SessionActions.fetchSessions.failed.listen(function (error: ErrorResponse) {
    NotificationActions.apiError('Failed to fetch sessions', error);
  });

  SessionActions.removeSession.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType
  ) {
    let that = this;
    SocketService.delete(`${sessionsUrl}/${session.id}`)
      .then(that.completed.bind(this, session))
      .catch(that.failed.bind(this, session));
  });

  SessionActions.removeSession.failed.listen(function (session: SessionType, error: ErrorResponse) {
    NotificationActions.apiError('Failed to remove session ' + session.id, error);
  });

  return Object.assign(actions, SessionActions);
}