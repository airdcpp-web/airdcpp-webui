import Reflux from 'reflux';

import {TRANSFER_MODULE_URL, STATISTICS} from 'constants/TransferConstants';

import SocketStore from './SocketStore'
import StorageMixin from 'mixins/StorageMixin'

export default Reflux.createStore({
  mixins: [StorageMixin],
  init: function() {
    this.getInitialState = this.getState;
    this._statistics = this.loadProperty("statistics", {
      speed_down: 0,
      speed_up: 0,
      session_down: 0,
      session_up: 0
    });
  },

  load: function() {
    SocketStore.addSocketListener(TRANSFER_MODULE_URL, STATISTICS, this.onStatistics);
  },

  unload: function() {
    SocketStore.removeSocketListener(TRANSFER_MODULE_URL, STATISTICS, this.onStatistics);
  },

  getState: function() {
    return {
      statistics: this._statistics
    };
  },

  onStatistics: function(data) {
    this._statistics = data;
    this.saveProperty("statistics", this._statistics);
    this.trigger(this.getState());
  }
});