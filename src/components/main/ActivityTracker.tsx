import { useEffect, useRef } from 'react';

import * as API from '@/types/api';

import LoginActions from '@/actions/reflux/LoginActions';

import { APISocket } from '@/services/SocketService';
import { useAppStore } from '@/context/StoreContext';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';

const SYSTEM_ALIVE_TIMEOUT = 30000;
const USER_ACTIVE_TIMEOUT = 30000;

export const useActivityTracker = (socket: APISocket) => {
  const activityStore = useAppStore().activity;

  const lastUserActive = useRef(Date.now());
  const lastSystemAlive = useRef(Date.now());

  const checkAlive = () => {
    const currentTime = Date.now();
    if (currentTime > lastSystemAlive.current + SYSTEM_ALIVE_TIMEOUT) {
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
    if (!activityStore.userActive) {
      return;
    }

    activityStore.setUserActive(false);
  };

  const checkActivity = () => {
    if (!activityStore.userActive) {
      return;
    }

    const currentTime = Date.now();
    if (currentTime > lastUserActive.current + USER_ACTIVE_TIMEOUT) {
      // Mark as inactive
      setUserInactive();
    } else {
      // Notify API that the user is still active
      ActivityAPIActions.sendActivity();
    }
  };

  const setActive = () => {
    lastUserActive.current = Date.now();
    if (activityStore.userActive) {
      return;
    }

    // Change the away state instantly when the user is known to be active again on the system
    // (window focus isn't relevant for this)
    if (activityStore.away === API.AwayEnum.IDLE) {
      ActivityAPIActions.sendActivity();
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

    ActivityAPIActions.sendActivity();

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

/*class ActivityTracker extends Component<{ socket: APISocket }> {
  systemAliveInterval: number | undefined;
  userActivityInteval: number | undefined;
  lastSystemAlive: number;
  lastUserActive: number;

  componentDidMount() {
    window.addEventListener('mousemove', this.setActive);
    window.addEventListener('keypress', this.setActive);
    window.addEventListener('focus', this.setActive);
    window.addEventListener('blur', this.setUserInactive);

    // Notify the API regurarly if the user is active due to idle away tracking
    this.userActivityInteval = window.setInterval(this.checkActivity, 60 * 1000);
    this.lastUserActive = Date.now();

    // Detect system wakeup and reconnect the socket then (the old connection is most likely not alive)
    this.systemAliveInterval = window.setInterval(this.checkAlive, 2000);
    this.lastSystemAlive = Date.now();

    ActivityActions.sessionActivity();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.setActive);
    window.removeEventListener('keypress', this.setActive);
    window.removeEventListener('focus', this.setActive);
    window.removeEventListener('blur', this.setUserInactive);

    clearInterval(this.userActivityInteval);
    clearInterval(this.systemAliveInterval);
  }

  shouldComponentUpdate() {
    return false;
  }

  checkAlive = () => {
    const { socket } = this.props;
    const currentTime = Date.now();
    if (currentTime > this.lastSystemAlive + SYSTEM_ALIVE_TIMEOUT) {
      // Require 30 seconds of downtime
      const minutesAgo = (currentTime - this.lastSystemAlive) / 60 / 1000;
      console.log(
        `Wake up detected (last successful activity check was ${minutesAgo} minutes ago)`,
      );

      // Woke up, disconnect the socket (it will be reconnected automatically)
      LoginActions.disconnect('Connection closed because of inactivity', socket);
    }

    this.lastSystemAlive = currentTime;
  };

  checkActivity = () => {
    if (!ActivityStore.userActive) {
      return;
    }

    const currentTime = Date.now();
    if (currentTime > this.lastUserActive + USER_ACTIVE_TIMEOUT) {
      // Mark as inactive
      this.setUserInactive();
    } else {
      // Notify API that the user is still active
      ActivityActions.sessionActivity();
    }
  };

  setActive = () => {
    this.lastUserActive = Date.now();
    if (ActivityStore.userActive) {
      return;
    }

    // Change the away state instantly when the user is known to be active again on the system
    // (window focus isn't relevant for this)
    if (ActivityStore.away === AwayEnum.IDLE) {
      ActivityActions.sessionActivity();
    }

    // Mouse over a background window? Don't mark sessions as read
    if (document.hasFocus()) {
      ActivityActions.userActiveChanged(true);
    }
  };

  setUserInactive = () => {
    if (!ActivityStore.userActive) {
      return;
    }

    ActivityActions.userActiveChanged(false);
  };

  render() {
    return null;
  }
}

export default ActivityTracker;*/
