import Reflux from 'reflux';

import {LOG_MODULE_URL, MAX_LOG_MESSAGES, LOG_MESSAGE, LOG_READ, LOG_CLEARED, SeverityEnum} from 'constants/LogConstants';

import SocketStore from './SocketStore'
import SocketService from 'services/SocketService'
import { LogActions } from 'actions/LogActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'

const LogStore = Reflux.createStore({
  listenables: LogActions,
  init: function() {
    this._logMessages = [];
  },

  getInitialState: function() {
    return this._logMessages;
  },

  onFetchMessagesCompleted: function(data) {
    this._logMessages = data;
    this.trigger(this._logMessages);
  },

  onFetchMessagesFailed: function(error) {
  },

  onLogMessage: function(data) {
    this._logMessages.push(data);
    if (this._logMessages.length > MAX_LOG_MESSAGES) {
      this._logMessages.shift();
    }

    this.trigger(this._logMessages);
  },

  onLogCleared: function(data) {
    this._logMessages = [];
    this.trigger(this._logMessages);
  },

  onLogRead: function(data) {
    this._logMessages = this._logMessages.map(message => 
      Object.assign({}, message, { is_read: true } )
    );
    
    this.trigger(this._logMessages);
  },

  getUnreadCounts() {
    var counts = {
      [SeverityEnum.INFO]: 0,
      [SeverityEnum.WARNING]: 0,
      [SeverityEnum.ERROR]: 0,
    }

    this._logMessages.forEach(message => {
      if (!message.is_read) {
        counts[message.severity] += 1;
      }
    });

    return counts;
  },

  get logMessages() {
    return this._logMessages;
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(LOG_MODULE_URL, LOG_MESSAGE, this.onLogMessage);
    addSocketListener(LOG_MODULE_URL, LOG_READ, this.onLogRead);
    addSocketListener(LOG_MODULE_URL, LOG_CLEARED, this.onLogCleared);
  }
});

export default SocketSubscriptionDecorator(LogStore)