import Reflux from 'reflux';
import {SOCKET_DISCONNECTED, SOCKET_CONNECTING, SOCKET_CONNECTED, SOCKET_MESSAGE} from 'constants/SocketConstants';
import SocketActions from 'actions/SocketActions';
import SocketService from 'services/SocketService';
import { EventEmitter } from 'events';

export default Reflux.createStore({
  listenables: SocketActions,
  init: function() {
    this.getInitialState = this.getState;

    this._socket = null;
    this._apiSubscriptions = {};
    this._apiEmitter = new EventEmitter();
  },

  onMessage(socket, event) {
    this._apiEmitter.emit(event.id ? event.event + event.id : event.event, event.data);
  },

  onStateConnected(socket) {
    this._socket = socket;
    this.trigger(this._socket);
  },

  onStateDisconnected(socket, error) {
    this._socket = null;
    this.trigger(this._socket, error);
  },

  addMessageListener(event, callback) {
    this._apiEmitter.on(event, callback);
  },

  addSocketListener(apiModuleUrl, event, callback, entityId) {
    var subscriptionId = event;
    var apiModuleUrlFull = apiModuleUrl;

    if (entityId) {
      apiModuleUrlFull += '/' + entityId;
      subscriptionId += entityId;
    }

    var listeners = this._apiSubscriptions[subscriptionId];
    if (listeners == undefined) {
      this._apiSubscriptions[subscriptionId] = 0;
    }

    this._apiSubscriptions[subscriptionId]++;
    this._apiEmitter.on(subscriptionId, callback);
    SocketService.post(apiModuleUrlFull + "/listener/" + event).catch(error => console.error("Failed to add socket listener", apiModuleUrlFull, event, error.message));

    return () => this.removeSocketListener(apiModuleUrl, event, callback, entityId);
  },

  removeSocketListener(apiModuleUrl, event, callback, entityId) {
    var subscriptionId = event;
    var apiModuleUrlFull = apiModuleUrl;

    if (entityId) {
      apiModuleUrlFull += '/' + entityId;
      subscriptionId += entityId;
    }

    var listeners = this._apiSubscriptions[subscriptionId];

    this._apiSubscriptions[subscriptionId]--;
    this._apiEmitter.removeListener(event, callback);
    SocketService.delete(apiModuleUrlFull + "/listener/" + event);
  },

  get socket() {
    return this._socket;
  },

  get state() {
    return this._state;
  }
});