import { useEffect, useRef } from 'react';

import * as API from '@/types/api';

import LoginActions from '@/actions/reflux/LoginActions';

import { APISocket } from '@/services/SocketService';
import { useSessionStoreApi } from '@/context/SessionStoreContext';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';

export interface ActivityTimeouts {
  system: number;
  user: number;
}

const DEFAULT_ACTIVITY_TIMEOUTS = {
  system: 30000,
  user: 30000,
};

export const useActivityTracker = (
  socket: APISocket,
  timeouts: ActivityTimeouts = DEFAULT_ACTIVITY_TIMEOUTS,
) => {
  const sessionStoreApi = useSessionStoreApi();

  const lastUserActive = useRef(Date.now());
  const lastSystemAlive = useRef(Date.now());

  const checkAlive = () => {
    const currentTime = Date.now();
    if (currentTime > lastSystemAlive.current + timeouts.system) {
      // Require 30 seconds of downtime
      const minutesAgo = (currentTime - lastSystemAlive.current) / 60 / 1000;
      console.log(
        `Wake up detected (last successful activity check was ${minutesAgo} minutes ago)`,
      );

      // Woke up, disconnect the socket (it will be reconnected automatically)
      LoginActions.disconnect('Connection closed because of inactivity', socket);
    }

    lastSystemAlive.current = currentTime;
  };

  const setUserInactive = () => {
    const activityStore = sessionStoreApi.getState().activity;
    if (!activityStore.userActive) {
      return;
    }

    activityStore.setUserActive(false);
  };

  const checkActivity = () => {
    const activityStore = sessionStoreApi.getState().activity;
    if (!activityStore.userActive) {
      return;
    }

    const currentTime = Date.now();
    if (currentTime > lastUserActive.current + timeouts.user) {
      // Mark as inactive
      setUserInactive();
    } else {
      // Notify API that the user is still active
      ActivityAPIActions.sendActivity(socket);
    }
  };

  const setActive = () => {
    const activityStore = sessionStoreApi.getState().activity;
    lastUserActive.current = Date.now();
    if (activityStore.userActive) {
      return;
    }

    // Change the away state instantly when the user is known to be active again on the system
    // (window focus isn't relevant for this)
    if (activityStore.away === API.AwayEnum.IDLE) {
      ActivityAPIActions.sendActivity(socket);
    }

    // Mouse over a background window? Don't mark sessions as read
    if (document.hasFocus()) {
      activityStore.setUserActive(true);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', setActive);
    window.addEventListener('keypress', setActive);
    window.addEventListener('focus', setActive);
    window.addEventListener('blur', setUserInactive);

    // Notify the API regurarly if the user is active due to idle away tracking
    const userActivityInteval = window.setInterval(checkActivity, 60 * 1000);

    // Detect system wakeup and reconnect the socket then (the old connection is most likely not alive)
    const systemAliveInterval = window.setInterval(checkAlive, 2000);

    ActivityAPIActions.sendActivity(socket);

    return () => {
      window.removeEventListener('mousemove', setActive);
      window.removeEventListener('keypress', setActive);
      window.removeEventListener('focus', setActive);
      window.removeEventListener('blur', setUserInactive);

      clearInterval(userActivityInteval);
      clearInterval(systemAliveInterval);
    };
  }, []);
};
