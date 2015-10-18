import Reflux from 'reflux';

import {TRANSFER_MODULE_URL, STATISTICS} from 'constants/TransferConstants';

import SocketStore from './SocketStore'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'

const TransferStatsStore = Reflux.createStore({
  init: function() {
    this.getInitialState = this.getState;
    this._statistics = {
      speed_down: 0,
      speed_up: 0,
      session_down: 0,
      session_up: 0
    };

    /*this._statistics = this.loadProperty("statistics", {
      speed_down: 0,
      speed_up: 0,
      session_down: 0,
      session_up: 0
    });*/
  },

  getState: function() {
    return {
      statistics: this._statistics
    };
  },

  onStatistics: function(data) {
    this._statistics = data;
    //this.saveProperty("statistics", this._statistics);
    this.trigger(this.getState());
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(TRANSFER_MODULE_URL, STATISTICS, this.onStatistics);
  }
});

export default SocketSubscriptionDecorator(TransferStatsStore)