import SocketStore from 'stores/SocketStore'
import LoginStore from 'stores/LoginStore'

export default {
  init: function() {
	this.listenTo(LoginStore, this._loginStoreListener);
	this._socketSubscriptions = [];
	this._hasSocket = false;
  },

  _loginStoreListener: function(loginState) {
  	if (loginState.socketAuthenticated) {
  		if (this._hasSocket) {
  			return;
  		}

  		this._hasSocket = true;
  		if (this.onSocketConnected) {
  			this.onSocketConnected();
  		}
  	} else {
  		if (!this._hasSocket) {
  			return;
  		}

  		this._socketSubscriptions = [];
  		this._hasSocket = false;

  		if (this.onSocketDisconnected) {
  			this.onSocketDisconnected();
  		}
  	}
  },

  addSocketListener: function(apiModuleUrl, event, callback) {
    let subscription = SocketStore.addSocketListener(apiModuleUrl, event, callback);
    this._socketSubscriptions.push(subscription);
    return subscription;
  },

  removeSocketListeners: function() {
    this._socketSubscriptions.forEach(f => f());
  }
};