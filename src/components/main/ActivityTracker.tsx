import { Component } from 'react';

import ActivityActions from 'actions/reflux/ActivityActions';
import LoginActions from 'actions/reflux/LoginActions';

import { AwayEnum } from 'constants/SystemConstants';
import ActivityStore from 'stores/ActivityStore';


class ActivityTracker extends Component {
  aliveInterval: number | undefined;
  activityInteval: number | undefined;
  lastAlive: number;

  componentDidMount() {
    window.addEventListener('mousemove', this.onUserInputActivity);
    window.addEventListener('keypress', this.onUserInputActivity);
    window.addEventListener('focus', this.onFocusChanged);
    window.addEventListener('blur', this.onFocusChanged);

    // Notify the API regurarly if the user is active due to idle away tracking
    this.activityInteval = window.setInterval(this.checkActivity, 60 * 1000);

    // Detect system wakeup and reconnect the socket then (the old connection is most likely not alive)
    this.aliveInterval = window.setInterval(this.checkAlive, 2000);
    this.lastAlive = Date.now();

    ActivityActions.sessionActivity();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onUserInputActivity);
    window.removeEventListener('keypress', this.onUserInputActivity);
    window.removeEventListener('focus', this.onFocusChanged);
    window.removeEventListener('blur', this.onFocusChanged);

    clearTimeout(this.activityInteval);
    clearInterval(this.aliveInterval);
  }

  shouldComponentUpdate() {
    return false;
  }

  checkAlive = () => {
    const currentTime = Date.now();
    if (currentTime > (this.lastAlive + 30000)) { // Require 30 seconds of downtime
      console.log(
        `Wake up detected (last successful activity check was ${(currentTime - this.lastAlive) / 60 / 1000} minutes ago)`
      );

      // Woke up, disconnect the socket (it will be reconnected automatically)
      LoginActions.disconnect('Connection closed because of inactivity');
    }

    this.lastAlive = currentTime;
  }

  checkActivity = () => {
    if (!ActivityStore.userActive) {
      return;
    }

    ActivityActions.sessionActivity();

    ActivityActions.userActiveChanged(false);
  }

  onFocusChanged = () => {
    const hasFocus = document.hasFocus();
    if (hasFocus !== ActivityStore.userActive) {
      ActivityActions.userActiveChanged(hasFocus);
    }
  }

  onUserInputActivity = () => {
    if (ActivityStore.userActive) {
      return;
    }

    // Change the state instantly when the user came back
    if (ActivityStore.away === AwayEnum.IDLE) {
      ActivityActions.sessionActivity();
    }

    // Mouse over a background window?
    if (document.hasFocus()) {
      ActivityActions.userActiveChanged(true);
    }
  }

  render() {
    return null;
  }
}

export default ActivityTracker;
