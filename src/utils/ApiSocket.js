import LoginConstants from 'constants/LoginConstants';
import SocketActions from 'actions/SocketActions';

import invariant from 'invariant';
import Promise from 'utils/Promise';

const ignoredConsoleEvents = [
	'transfer_statistics',
	'hash_statistics',
	'hub_counts_updated',
];

const handleLogin = (username, password, userSession, socket) => {
	return socket.sendRequest(LoginConstants.LOGIN_URL, { 
		username, 
		password,
		user_session: userSession,
	}, 'POST');
};

const handleAuthorize = (authorization, socket) => {
	return socket.sendRequest(LoginConstants.CONNECT_URL, { authorization }, 'POST');
};

export default class ApiSocket {
	constructor(apiUrl) {
		invariant(apiUrl, 'API URL must be supplied for the socket constructor');

		this.apiUrl = apiUrl;
		this.socket = null;
		this.init = false;
		this.currentCallbackId = 0;
		this.authenticated = false;
		this._reconnectTimer = null;

		// Keep all pending requests here until they get responses
		this.callbacks = {};
	}

	connect(username, password, userSession) {
		return this.startConnect(false, handleLogin.bind(this, username, password, userSession));
	}

	reconnect(token) {
		return this.startConnect(true, handleAuthorize.bind(this, token));
	}

	startConnect(reconnectOnFailure, authenticationHandler) {
		SocketActions.state.connecting(this);

		return new Promise((resolve, reject) => {
			console.log('Starting socket connect');
			this.connectInternal(reconnectOnFailure, resolve, reject, authenticationHandler);
		});
	}

	connectInternal(reconnectOnFailure, resolve, reject, authenticationHandler) {
		this.socket = new WebSocket(this.apiUrl);

		const scheduleReconnect = () => {
			this._reconnectTimer = setTimeout(() => {
				console.log('Socket reconnecting');
				this.connectInternal(reconnectOnFailure, resolve, reject, authenticationHandler);
			}, 3000);
		};

		this.socket.onopen = () => {
			console.log('Socket connected');
			this._reconnectTimer = null;

			this.setSocketHandlers();

			authenticationHandler(this)
				.then((data) => {
					// Authentication succeed
					SocketActions.state.connected(this);
					resolve(data);
				})
				.catch((error) => {
					if (this.socket) {
						// Authentication was rejected
						this.disconnect();
					} else if (reconnectOnFailure) {
						// Socket was disconnected during the authentication
						scheduleReconnect();
						return;
					} 

					reject(error);
				});
		};

		this.socket.onerror = (event) => {
			console.log('Connecting socket failed');
			SocketActions.state.disconnected(this, 'Cannot connect to the server');

			if (reconnectOnFailure) {
				scheduleReconnect();
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

			// Clear callbacks
			Object.keys(this.callbacks).forEach(id => this.callbacks[id].resolver.reject({ message: 'Socket disconnected' }));
			this.callbacks = {};
			
			this.socket = null;
			SocketActions.state.disconnected(this, event.reason, event.code);
		};
		
		this.socket.onmessage = (event) => {
			this.listener(event);
		};
	}

	sendRequest(path, data, method) {
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
