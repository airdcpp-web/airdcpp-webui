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
    this._apiEmitter.emit(event.event, event.data);
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

  addSocketListener(apiModuleUrl, event, callback) {
    var listeners = this._apiSubscriptions[apiModuleUrl];
    if (listeners == undefined) {
      this._apiSubscriptions[apiModuleUrl] = 0;
    }

    this._apiSubscriptions[apiModuleUrl]++;
    this._apiEmitter.on(event, callback);
    SocketService.post(apiModuleUrl + "/listener/" + event).catch(error => console.error("Failed to add socket listener", apiModuleUrl, event, error.message));

    return () => this.removeSocketListener(apiModuleUrl, event, callback);
  },

  removeSocketListener(apiModuleUrl, event, callback) {
    var listeners = this._apiSubscriptions[apiModuleUrl];

    this._apiSubscriptions[apiModuleUrl]--;
    this._apiEmitter.removeListener(event, callback);
    SocketService.delete(apiModuleUrl + "/listener/" + event);
  },

  get socket() {
    return this._socket;
  },

  get state() {
    return this._state;
  }
});