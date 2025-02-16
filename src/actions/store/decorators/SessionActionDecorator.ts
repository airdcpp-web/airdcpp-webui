import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (sessionsUrl: string) {
  const fetchSessions = async (sessionStore: UI.SessionSlice<UI.SessionType>) => {
    try {
      const sessions: UI.SessionType[] = await SocketService.get(sessionsUrl);
      sessionStore.init(sessions);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to fetch sessions', error);
    }
  };

  const removeSession = (session: SessionType) => {
    return SocketService.delete(`${sessionsUrl}/${session.id}`).catch((e) => {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to remove session ' + session.id, error);
    });
  };

  return {
    fetchSessions,
    removeSession,
  };
}
