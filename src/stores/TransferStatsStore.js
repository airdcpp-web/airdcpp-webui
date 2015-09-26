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


/*class MainStore extends BaseStore {

  constructor() {
    super();

    this.changeListener = this._socketListener.bind(this);
    SocketStore.addListener(SOCKET_MESSAGE, this.changeListener);
    this.subscribe(() => this._registerToActions.bind(this))

    var savedMessages = sessionStorage.getItem('log_messages');
    if (savedMessages != null && savedMessages != undefined) {
      this._messages = JSON.parse(savedMessages);
    } else {
      this._logMessages = [ { 
        severity: 2,
        text: 'Failed to add the directory C:\\airbuilds\\nightly\\ for monitoring: The system cannot find the path specified.',
        time: 42151251522
      },
      { 
        severity: 0,
        text: 'Auto search: A failed bundle JetBrains.WebStorm.v10.0.141.456.Incl.KeyMaker-DVT has been searched for',
        time: 42151251524
      }];
    }

    var savedStats = sessionStorage.getItem('statistics');
    if (savedStats != null && savedStats != undefined) {
      this._statistics = JSON.parse(savedStats);
    } else {
      this._statistics = {
        speed_down: 0,
        speed_up: 0,
        session_down: 0,
        session_up: 0
      };
    }

    var savedCounters = sessionStorage.getItem('log_counters');
    if (savedCounters != null && savedCounters != undefined) {
      this._counters = JSON.parse(savedCounters);
    } else {
      //this.resetLogCounters();
      this._counters = { 
        log_info: 3,
        log_warnings: 6,
        log_errors: 2 
      };
    }
  }

  resetLogCounters() {
    this._counters = { 
      log_info: 0,
      log_warnings: 0,
      log_errors: 0 
    };
  }

  saveLogCounters() {
    sessionStorage.setItem('log_counters', JSON.stringify(this._counters));
  }

  saveLogMessages() {
    sessionStorage.setItem('log_messages', JSON.stringify(this._messages));
  }

  saveStats() {
    sessionStorage.setItem('statistics', JSON.stringify(this._statistics));
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case RESET_LOG_COUNTERS:
        this.resetLogCounters();
        this.saveLogCounters();
        this.emitChange();
        break;
      default:
        break;
    };
  }

  get messages() {
    return this._logMessages;
  }

  get statistics() {
    return this._statistics;
  }

  get counters() {
    return this._counters;
  }
}

export default new MainStore();*/
