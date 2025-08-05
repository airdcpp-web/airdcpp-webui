import { APISocket } from '@/services/SocketService';

import NotificationActions from '@/actions/NotificationActions';

import * as UI from '@/types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

type SessionType = UI.SessionItemBase;

export default function (sessionsUrl: string) {
  const fetchSessions = async (
    sessionStore: UI.SessionSlice<UI.SessionItem>,
    socket: APISocket,
  ) => {
    try {
      const sessions: UI.SessionItem[] = await socket.get(sessionsUrl);
      sessionStore.init(sessions);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to fetch sessions', error);
    }
  };

  const removeSession = (sessionItem: SessionType, socket: APISocket) => {
    return socket.delete(`${sessionsUrl}/${sessionItem.id}`).catch((e) => {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to remove session ' + sessionItem.id, error);
    });
  };

  return {
    fetchSessions,
    removeSession,
  };
}
