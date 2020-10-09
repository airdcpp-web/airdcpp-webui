'use strict';
import React from 'react';

import LoginActions from 'actions/reflux/LoginActions';
import { AwayEnum } from 'constants/SystemConstants';
import ActivityStore from 'stores/ActivityStore';


// Don't change this if the component is re-mounted
let userActive = true;

class ActivityTracker extends React.Component {
  aliveInterval: number | undefined;
  activityInteval: number | undefined;
  lastAlive: number;

  componentDidMount() {
    document.onmousemove = this.onUserActivity;
    document.onkeypress = this.onUserActivity;

    // Notify the API regurarly if the user is active due to idle away tracking
    this.activityInteval = window.setInterval(this.checkActivity, 60 * 1000);

    // Detect system wakeup and reconnect the socket then (the old connection is most likely not alive)
    this.aliveInterval = window.setInterval(this.checkAlive, 2000);
    this.lastAlive = Date.now();

    LoginActions.activity();
  }

  componentWillUnmount() {
    document.onmousemove = null;
    document.onkeypress = null;

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
      LoginActions.disconnect('Wake up detected');
    }

    this.lastAlive = currentTime;
  }

  checkActivity = () => {
    if (!userActive) {
      return;
    }

    LoginActions.activity();
    userActive = false;
  }

  onUserActivity = () => {
    if (userActive) {
      return;
    }

    // Change the state instantly when the user came back
    userActive = true;
    if (ActivityStore.away === AwayEnum.IDLE) {
      LoginActions.activity();
    }
  }

  render() {
    return null;
  }
}

export default ActivityTracker;
