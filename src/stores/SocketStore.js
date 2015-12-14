import Reflux from 'reflux';
import SocketActions from 'actions/SocketActions';
import SocketService from 'services/SocketService';
import { EventEmitter } from 'events';

const getSubscribtionId = (event, id) => {
	return id ? (event + id) : event;
};

const getSubscribtionUrl = (moduleUrl, id, event) => {
	if (id) {
		return moduleUrl + '/' + id + '/listener/' + event;
	}

	return moduleUrl + '/listener/' + event;
};

export default Reflux.createStore({
	listenables: SocketActions,
	init: function () {
		this.getInitialState = this.getState;

		this._socket = null;
		this._apiSubscriptions = {};
		this._apiEmitter = new EventEmitter();
	},

	onMessage(socket, event) {
		if (event.id) {
			// There can be subscribers for a single entity or for all events of this type... emit for both
			this._apiEmitter.emit(event.event + event.id, event.data, event.id);
			this._apiEmitter.emit(event.event, event.data, event.id);
		} else {
			this._apiEmitter.emit(event.event, event.data);
		}
	},

	onStateConnected(socket) {
		this._socket = socket;
		this.trigger(this._socket);
	},

	onStateDisconnected(socket, error, id) {
		this._socket = null;
		this.trigger(this._socket, error);
	},

	// Listen to a specific event without sending subscription to the server
	addMessageListener(event, callback, id) {
		const subscriptionId = getSubscribtionId(event, id);
		this._apiEmitter.on(subscriptionId, callback);
		return () => this._removeMessageListener(subscriptionId, callback); 
	},

	_removeMessageListener(subscriptionId, callback) {
		this._apiEmitter.removeListener(subscriptionId, callback);
	},

	addSocketListener(apiModuleUrl, event, callback, entityId) {
		var subscriptionId = getSubscribtionId(event, entityId);
		var subscriptionUrl = getSubscribtionUrl(apiModuleUrl, entityId, event);

		this._apiEmitter.on(subscriptionId, callback);

		var listeners = this._apiSubscriptions[subscriptionId];
		if (!listeners) {
			this._apiSubscriptions[subscriptionId] = 0;
			SocketService.post(subscriptionUrl).catch(error => console.error('Failed to add socket listener', subscriptionUrl, event, entityId, error.message));
		}

		this._apiSubscriptions[subscriptionId]++;

		return (socketAuthenticated) => this._removeSocketListener(subscriptionUrl, subscriptionId, callback, socketAuthenticated);
	},

	_removeSocketListener(subscriptionUrl, subscriptionId, callback, socketAuthenticated) {
		this._apiSubscriptions[subscriptionId]--;
		this._apiEmitter.removeListener(subscriptionId, callback);

		if (this._apiSubscriptions[subscriptionId] === 0) {
			if (this._socket && socketAuthenticated) {
				SocketService.delete(subscriptionUrl)
					.catch(error => console.error('Failed to remove socket listener', subscriptionUrl, subscriptionId, error));
			}

			delete this._apiSubscriptions[subscriptionId];
		}
	},

	get socket() {
		return this._socket;
	},

	get state() {
		return this._state;
	}
});
