import LoginStore from '../stores/LoginStore';
import SocketActions from '../actions/SocketActions';

import BlueBird from 'bluebird';

export default class ApiSocket {
    constructor() {
        this.socket = null;
        this.init = false;
        this.currentCallbackId = 0;
        this.authenticated = false;
        this._reconnectTimer = null;

        // Keep all pending requests here until they get responses
        this.callbacks = {};
    }

    /*isOpen() {
        return this.socket.readyState == this.socket.OPEN;
    }*/

    isConnecting() {
        return this.socket.readyState == this.socket.CONNECTING;
    }

  connect(reconnectOnFailure) {
    SocketActions.state.connecting(self);

    let self = this;

    return new Promise(function(resolve, reject) {
        console.log("Starting socket connect");
        self.connectInternal(reconnectOnFailure, resolve, reject, self);
    });
  }

  connectInternal(reconnectOnFailure, resolve, reject, self) {
    /*var failed = false;
    var handleReconnect = function(){
        self._reconnectTimer = setTimeout(() => {
            failed = false;
            console.log("Socket reconnecting");
            self.connectInternal(reconnectOnFailure, resolve, reject, self);
        }, 3000);
    };*/

    self.socket = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host + '/');

    self.socket.onopen = function(){
        self._reconnectTimer = null;

        self.setHandlers(self.socket);
        SocketActions.state.connected(self);
        resolve(self);
    }

    self.socket.onerror = function(event){
        console.log("Connecting socket failed");
        SocketActions.state.disconnected(self, "Connecting failed");

        if (reconnectOnFailure) {
            self._reconnectTimer = setTimeout(() => {
                console.log("Socket reconnecting");
                self.connectInternal(reconnectOnFailure, resolve, reject, self);
            }, 3000);
        } else {
            reject("Connecting failed");
        }
    }
  }

  disconnect() {
    if (self._reconnectTimer != null) {
        clearTimeout(self._reconnectTimer);
    }
    
    this.socket.close();
  }

  setHandlers(socket) {
    let self = this;
    this.socket.onerror = function(event){
        console.log("Websocket error: " + event.reason);
    }
    this.socket.onclose = function(event){
        console.log("Websocket was closed: " + event.reason);
        SocketActions.state.disconnected(self, event.reason);
    }
    this.socket.onmessage = function(event){
        console.log("Websocket data received: " + event.data);
        self.listener(event);
    }
  }

  sendRequest(data, path, method) {
    if (this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING) {
        console.log('Attempting to send request on a closed socket: ' + path);
        return Promise.reject("No socket");
    }

      var resolver = BlueBird.pending();
      var callbackId = this.getCallbackId();
      
      this.callbacks[callbackId] = {
        time: new Date(),
        resolver:resolver
      };

      console.log('Sending request', path, data);

    var request = {
      path: path,
      method: method,
      data: data,
      callback_id: callbackId
    }

      this.socket.send(JSON.stringify(request));
      return resolver.promise;
    }

    listener(event) {
      var messageObj = JSON.parse(event.data);
      console.log("Received data from websocket: ", messageObj);

      if(this.callbacks.hasOwnProperty(messageObj.callback_id)) {
        // Callback

        if (messageObj.code == 200) {
          console.log("Websocket request succeed: " + this.callbacks[messageObj.callback_id]);
          this.callbacks[messageObj.callback_id].resolver.resolve(messageObj.data);
        } else {
          console.log("Websocket request " + this.callbacks[messageObj.callback_id] + " failed with code " + messageObj.code + ": " + messageObj.error);
          this.callbacks[messageObj.callback_id].resolver.reject({ reason: messageObj.error, code: messageObj.code});
        }

        delete this.callbacks[messageObj.callback_id];
      } else {
        // Listener message
        SocketActions.message(this, messageObj);
      }
    }

    // This creates a new callback ID for a request
    getCallbackId() {
      this.currentCallbackId += 1;
      if(this.currentCallbackId > 10000) {
        this.currentCallbackId = 0;
      }
      return this.currentCallbackId;
    }
}
    