//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (
  actions: UI.RefluxActionConfigList<SessionType>[],
  sessionsUrl: string,
) {
  const SessionActionConfig: UI.RefluxActionConfigList<SessionType> = [
    { fetchSessions: { asyncResult: true } },
    { removeSession: { asyncResult: true } },
    'sessionChanged',
  ];

  const SessionActions = Reflux.createActions(SessionActionConfig);

  SessionActions.fetchSessions.listen(function (this: UI.AsyncActionType<SessionType>) {
    const that = this;
    SocketService.get(sessionsUrl).then(that.completed).catch(that.failed);
  });

  SessionActions.fetchSessions.failed.listen(function (error: ErrorResponse) {
    NotificationActions.apiError('Failed to fetch sessions', error);
  });

  SessionActions.removeSession.listen(function (
    this: UI.AsyncActionType<SessionType>,
    session: SessionType,
  ) {
    const that = this;
    SocketService.delete(`${sessionsUrl}/${session.id}`)
      .then(that.completed.bind(this, session))
      .catch(that.failed.bind(this, session));
  });

  SessionActions.removeSession.failed.listen(function (
    session: SessionType,
    error: ErrorResponse,
  ) {
    NotificationActions.apiError('Failed to remove session ' + session.id, error);
  });

  return Object.assign(actions, SessionActions);
}
