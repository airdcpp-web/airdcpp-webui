import { APISocket } from '@/services/SocketService';

import SessionConstants from '@/constants/SessionConstants';
import SystemConstants from '@/constants/SystemConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import NotificationActions from '@/actions/NotificationActions';
import { translate } from '@/utils/TranslationUtils';
import { ErrorResponse } from 'airdcpp-apisocket';

const sendActivity = (socket: APISocket) => {
  socket
    .post(SessionConstants.ACTIVITY_URL, {
      user_active: true,
    })
    .catch(() => {
      // Ignore
    });
};

const fetchAway = async (sessionStore: UI.SessionStore, socket: APISocket) => {
  const awayState = await socket.get<API.AwayState>(SystemConstants.AWAY_STATE_URL);
  sessionStore.activity.setAway(awayState);
};

const setAway = async (away: boolean, socket: APISocket, t: UI.TranslateF) => {
  try {
    await socket.post(SystemConstants.AWAY_STATE_URL, {
      away,
    });
  } catch (e) {
    const error: ErrorResponse = e;
    NotificationActions.apiError('Failed to set away mode', error);
  }

  NotificationActions.info({
    title: translate(
      away ? 'Away mode was enabled' : 'Away mode was disabled',
      t,
      UI.Modules.COMMON,
    ),
  });
};

export const ActivityAPIActions = {
  sendActivity,
  fetchAway,
  setAway,
};
