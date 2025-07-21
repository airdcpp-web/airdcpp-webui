import { APISocket } from '@/services/SocketService';

import NotificationActions from '@/actions/NotificationActions';

import * as UI from '@/types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (sessionsUrl: string) {
  const fetchSessions = async (
    sessionStore: UI.SessionSlice<UI.SessionType>,
    socket: APISocket,
  ) => {
    try {
      const sessions: UI.SessionType[] = await socket.get(sessionsUrl);
      sessionStore.init(sessions);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to fetch sessions', error);
    }
  };

  const removeSession = (session: SessionType, socket: APISocket) => {
    return socket.delete(`${sessionsUrl}/${session.id}`).catch((e) => {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to remove session ' + session.id, error);
    });
  };

  return {
    fetchSessions,
    removeSession,
  };
}
