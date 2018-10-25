import Reflux from 'reflux';

import { default as SystemConstants, AwayEnum } from 'constants/SystemConstants';
import SystemActions from 'actions/SystemActions';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';


const ActivityStore = Reflux.createStore({
  listenables: SystemActions,
  init: function () {
    this._away = AwayEnum.OFF;
    this.getInitialState = this.getState;
  },

  getState: function () {
    return {
      away: this._away,
    };
  },

  onFetchAwayCompleted: function (data) {
    this._away = data.id;
    this.trigger(this.getState());
  },

  get away() {
    return this._away;
  },

  onSocketConnected(addSocketListener) {
    const url = SystemConstants.MODULE_URL;
    addSocketListener(url, SystemConstants.AWAY_STATE, this.onFetchAwayCompleted);
  }
});

export default SocketSubscriptionDecorator(ActivityStore);
