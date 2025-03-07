import SocketService from '@/services/SocketService';

import SessionConstants from '@/constants/SessionConstants';
import SystemConstants from '@/constants/SystemConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import NotificationActions from '@/actions/NotificationActions';
import { translate } from '@/utils/TranslationUtils';
import { ErrorResponse } from 'airdcpp-apisocket';

const sendActivity = () => {
  SocketService.post(SessionConstants.ACTIVITY_URL, {
    user_active: true,
  }).catch(() => {
    // Ignore
  });
};

const fetchAway = async (store: UI.Store) => {
  const awayState = await SocketService.get<API.AwayState>(
    SystemConstants.MODULE_URL + '/away',
  );
  store.activity.setAway(awayState);
};

const setAway = async (away: boolean, t: UI.TranslateF) => {
  try {
    await SocketService.post(SystemConstants.MODULE_URL + '/away', {
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
