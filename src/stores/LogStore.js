import Reflux from 'reflux';

import {LOG_MODULE_URL, MAX_LOG_MESSAGES, LOG_MESSAGE} from '../constants/LogConstants';

import SocketStore from './SocketStore'
import SocketService from '../services/SocketService'
import StorageMixin from '../mixins/StorageMixin'
import { LogActions } from '../actions/LogActions'

export default Reflux.createStore({
  listenables: LogActions,
  mixins: [StorageMixin],
  init: function() {
    this.getInitialState = this.getState;

    this._logMessages = this.loadProperty("log_messages", []);
    this._logCounters = this.loadProperty("log_counters", {
      log_info: 3,
      log_warnings: 6,
      log_errors: 2
    });
  },

  load: function() {
    SocketStore.addSocketListener(LOG_MODULE_URL, LOG_MESSAGE, this.onLogMessage);
    if (this._logMessages.length == 0) {
      LogActions.fetchLastMessages();
    }
  },

  unload: function() {
    SocketStore.removeSocketListener(LOG_MODULE_URL, LOG_MESSAGE, this.onLogMessage);
  },

  getState: function() {
    return {
      log_counters: this._logCounters,
      log_messages: this._logMessages
    };
  },

  onFetchLastMessagesCompleted: function(data) {
    this._logMessages = data;
    this.onChanged();
  },

  onFetchLastMessagesFailed: function(error) {
  },

  onResetLogCounters: function() {
    this._logCounters = { 
      log_info: 0,
      log_warnings: 0,
      log_errors: 0 
    };

    this.onChanged();
  },

  onLogMessage: function(data) {
    this._logMessages.push(data);
    if (this._logMessages.length > MAX_LOG_MESSAGES) {
      this._logMessages.shift();
    }

    if (data.severity == 0) {
      this._logCounters["log_info"]++;
    } else if (data.severity == 1) {
      this._logCounters["log_warnings"]++;
    } else if (data.severity == 2) {
      this._logCounters["log_errors"]++;
    }

    this.onChanged();
  },

  onChanged: function() {
    this.saveProperty("log_counters", this._logCounters);
    this.saveProperty("log_messages", this._logMessages);
    this.trigger(this.getState());
  },

  get logMessages() {
    return this._logMessages;
  },

  get logCounters() {
    return this._logCounters;
  }
});