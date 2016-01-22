import SocketActions from 'actions/SocketActions';

import Promise from 'utils/Promise';

const ignoredConsoleEvents = [
	'transfer_statistics',
	'hash_statistics',
	'hub_counts_updated',
];

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

	connect(reconnectOnFailure) {
		SocketActions.state.connecting(this);

		return new Promise((resolve, reject) => {
			console.log('Starting socket connect');
			this.connectInternal(reconnectOnFailure, resolve, reject);
		});
	}

	connectInternal(reconnectOnFailure, resolve, reject) {
		this.socket = new WebSocket((window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host + '/');

		this.socket.onopen = () => {
			console.log('Socket connected');
			this._reconnectTimer = null;

			this.setSocketHandlers();
			SocketActions.state.connected(this);
			resolve(this);
		};

		this.socket.onerror = (event) => {
			console.log('Connecting socket failed');
			SocketActions.state.disconnected(this, 'Cannot connect to the server');

			if (reconnectOnFailure) {
				this._reconnectTimer = setTimeout(() => {
					console.log('Socket reconnecting');
					this.connectInternal(reconnectOnFailure, resolve, reject);
				}, 3000);
			} else {
				reject('Cannot connect to the server');
			}
		};
	}

	disconnect() {
		console.log('Disconnecting socket');
		if (this._reconnectTimer != null) {
			clearTimeout(this._reconnectTimer);
		}

		this.socket.close();
	}

	setSocketHandlers() {
		this.socket.onerror = (event) => {
			console.log('Websocket error: ' + event.reason);
		};

		this.socket.onclose = (event) => {
			console.log('Websocket was closed: ' + event.reason);
			SocketActions.state.disconnected(this, event.reason, event.code);
		};
		
		this.socket.onmessage = (event) => {
			this.listener(event);
		};
	}

	sendRequest(data, path, method) {
		if (this.socket.readyState == this.socket.CLOSED || this.socket.readyState == this.socket.CLOSING) {
			console.log('Attempting to send request on a closed socket: ' + path);
			return Promise.reject('No socket');
		}

		let resolver = Promise.pending();
		const callbackId = this.getCallbackId();

		this.callbacks[callbackId] = {
			time: new Date(),
			resolver:resolver
		};

		console.log(callbackId, method, path, data ? data : '(no data)');

		const request = {
			path,
			method,
			data,
			callback_id: callbackId,
		};

		this.socket.send(JSON.stringify(request));
		return resolver.promise;
	}

	listener(event) {
		const messageObj = JSON.parse(event.data);

		if (this.callbacks.hasOwnProperty(messageObj.callback_id)) {
			// Callback

			if (messageObj.code >= 200 && messageObj.code <= 204) {
				console.info(messageObj.callback_id, 'SUCCEED', messageObj.data ? messageObj.data : '(no data)');
				this.callbacks[messageObj.callback_id].resolver.resolve(messageObj.data);
			} else {
				console.assert(messageObj.error, 'Invalid error response received from the API');
				console.warn(messageObj.callback_id, messageObj.code, messageObj.error.message);
				this.callbacks[messageObj.callback_id].resolver.reject({ message: messageObj.error.message, code: messageObj.code, json: messageObj.error });
			}

			delete this.callbacks[messageObj.callback_id];
		} else {
			// Listener message
			if (ignoredConsoleEvents.indexOf(messageObj.event) == -1) {
				console.log(messageObj.event, messageObj.id ? messageObj.id : '-', messageObj.data);
			}

			SocketActions.message(this, messageObj);
		}
	}

	// This creates a new callback ID for a request
	getCallbackId() {
		this.currentCallbackId += 1;
		if (this.currentCallbackId > 10000) {
			this.currentCallbackId = 0;
		}

		return this.currentCallbackId;
	}
}
