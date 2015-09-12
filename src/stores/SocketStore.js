import Reflux from 'reflux';
import {SOCKET_DISCONNECTED, SOCKET_CONNECTING, SOCKET_CONNECTED, SOCKET_MESSAGE} from '../constants/SocketConstants';
import SocketActions from '../actions/SocketActions';
import SocketService from '../services/SocketService';
//import SocketStoreActions from '../actions/SocketStoreActions';
import { EventEmitter } from 'events';

export default Reflux.createStore({
  listenables: SocketActions,
  //mixins: [StorageMixin],
  init: function() {
    this.getInitialState = this.getState;

    //this._state = SOCKET_DISCONNECTED;
    this._socket = null;
    this._apiSubscriptions = {};
    this._apiEmitter = new EventEmitter();
    //SocketStore.addListener(LOG_MESSAGE, this.onLogMessage);

    //var tmp1 = SocketStoreActions;
    //this.listenTo(SocketStoreActions.stateChanged,this.onStateChanged);
  },

  onMessage(socket, event) {
    this._apiEmitter.emit(event.event, event.data);
  },

  /*onStateChanged(socket, state) {
    if (state == SOCKET_DISCONNECTED) {
      this._socket = null;
    } else if (state == SOCKET_CONNECTING) {
      this._socket = socket;
    }

    //this._state = state;
    this.trigger(this._socket);
  },*/

  onStateConnected(socket) {
    this._socket = socket;
    this.trigger(this._socket);
  },

  onStateDisconnected(socket, error) {
    /*if (!this._socket) {
      // Don't confuse listeners
      return;
    }*/

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
    SocketService.post(apiModuleUrl + "/listener/" + event);
  },

  removeSocketListener(apiModuleUrl, event, callback) {
    var listeners = this._apiSubscriptions[apiModuleUrl];

    this._apiSubscriptions[apiModuleUrl]--;
    this._apiEmitter.removeListener(event, callback);
    SocketService.delete(apiModuleUrl + "/listener/" + event);

    //if (listeners == 0) {
    //  delete this._apiSubscriptions[apiModuleUrl];
    //}
  },

  get socket() {
    return this._socket;
  },

  get state() {
    return this._state;
  }
});


/*class SocketStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._state = SOCKET_DISCONNECTED;
    this._socket = null;
    this._apiSubscriptions = {};
    this._apiEmitter = new EventEmitter();
  }

  addListener(event, cb) {
    this.on(event, cb)
  }

  removeListener(event, cb) {
    this.removeListener(event, cb);
  }

  addSocketListener(apiModuleUrl, event, callback) {
    var listeners = this._apiSubscriptions[apiModuleUrl];
    if (listeners == undefined) {
      this._apiSubscriptions[apiModuleUrl] = 0;
    }

    this._apiSubscriptions[apiModuleUrl]++;
    this._apiEmitter.on(event, callback);
    SocketActions.post(apiModuleUrl + "/listener/" + event);
  }

  removeSocketListener(apiModuleUrl, event, callback) {
    var listeners = this._apiSubscriptions[apiModuleUrl];

    this._apiSubscriptions[apiModuleUrl]--;
    this._apiEmitter.removeListener(event, callback);
    SocketActions.delete(apiModuleUrl + "/listener/" + event);

    //if (listeners == 0) {
    //  delete this._apiSubscriptions[apiModuleUrl];
    //}
  }

  get addSocketSubscriber(apiModuleUrl, event, callback) {
    if (!Array.isArray(event)) {
      event = [ event ];
    }

    var listeners = this._apiSubscriptions[apiSubscriptionName];
    if (listeners == undefined) {
      this._apiSubscriptions[apiModuleUrl] = 0;
      SocketActions.post(apiModuleUrl + "/listener", {
        events: event;
      });
    }

    this._apiSubscriptions[apiSubscriptionName] += event.length;

    event.forEach((e) => {
      this.emitter.on(e, callback);
    });
  }

  get removeSocketSubscriber(apiModuleUrl, event, callbacks) {
    if (!Array.isArray(event)) {
      event = [ event ];
    }

    var listeners = this._apiSubscriptions[apiSubscriptionName];

    this._apiSubscriptions[apiSubscriptionName] -= event.length;
    event.forEach((e) => {
      this.emitter.removeListener(e, callback);
      //this.emitter.on(e, callback);
    });
   // this.emitter.removeListener(event, callback);

    if (listeners == 0) {
      delete this._apiSubscriptions[apiSubscriptionName];
      SocketActions.delete(apiModuleUrl + "/listener", {
        events: event;
      });
    }
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case SOCKET_DISCONNECTED:
        this._state = SOCKET_DISCONNECTED;
        this.emitChange();
        break;
      case SOCKET_CONNECTING:
        this._socket = action.socket;
        this._state = SOCKET_CONNECTING;
        this.emitChange();
        break;
      case SOCKET_CONNECTED:
        this._state = SOCKET_CONNECTED;
        this.emitChange();
        break;
      case SOCKET_MESSAGE:
        this._apiEmitter.emit(action.event, action.data);
        break;
      default:
        break;
    };
  }

  get socket() {
    return this._socket;
  }

  get state() {
    return this._state;
  }
}*/

//export default new SocketStore();