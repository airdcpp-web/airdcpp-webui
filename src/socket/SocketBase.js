import LoginConstants from 'constants/LoginConstants';

import SocketLogger from './SocketLogger';
import SocketSubscriptionHandler from './SocketSubscriptionHandler';
import SocketRequestHandler from './SocketRequestHandler';

//import invariant from 'invariant';
import Promise from 'utils/Promise';


const ApiSocket = (options, WebSocketImpl = WebSocket) => {
	let subscriptions = null;
	let requests = null;

	let ws = null;
	let authToken = null;

	let socket = null;
	let reconnectTimer = null;

	let connectedHandler = null;
	let disconnectedHandler = null;

	const logger = SocketLogger(options);


	const onClosed = (event) => {
		logger.info(event.reason ? 'Websocket was closed: ' + event.reason : 'Websocket was closed');

		requests.onSocketDisconnected();
		if (disconnectedHandler) {
			disconnectedHandler(event.reason, event.code);
		}

		ws = null;
		if (authToken && options.autoReconnect) {
			socket.reconnect()
				.catch((error) => console.error('Reconnect failed for a closed socket', error.message));
		}
	};

	const onMessage = (event) => {
		const messageObj = JSON.parse(event.data);
		if (messageObj.callback_id) {
			// Callback
			requests.handleMessage(messageObj);
		} else {
			// Listener message
			subscriptions.handleMessage(messageObj);
		}
	};

	const setSocketHandlers = () => {
		subscriptions = SocketSubscriptionHandler(socket, logger, options);
		requests = SocketRequestHandler(socket, logger, options);

		ws.onerror = (event) => {
			logger.error('Websocket failed: ' + event.reason);
		};

		ws.onclose = onClosed;
		ws.onmessage = onMessage;
	};

	const handleLogin = (username = options.username, password = options.password) => {
		return socket.post(LoginConstants.LOGIN_URL, { 
			username, 
			password,
			user_session: options.userSession,
		}, true);
	};

	const handleAuthorize = () => {
		return socket.post(LoginConstants.CONNECT_URL, { 
			authorization: authToken,
		}, true);
	};

	const authenticate = (resolve, reject, authenticationHandler, reconnectHandler) => {
		authenticationHandler()
			.then((data) => {
				// Authentication succeed

				if (data) {
					logger.info('Login succeed');
					authToken = data.token;
				} else {
					logger.info('Socket associated with an existing session');
				}

				if (connectedHandler) {
					// Catch separately as we don't want an infinite reconnect loop
					try {
						connectedHandler(data);
					} catch (e) {
						console.error('Error in socket connect handler', e.message);
					}
				}

				resolve(data);
			})
			.catch((error) => {
				if (error.code) {
					if (authToken && error.code === 400 && options.autoReconnect) {
						// The session was lost (most likely the client was restarted)
						logger.info('Session lost, re-sending credentials');

						authToken = null;
						authenticate(resolve, reject, handleLogin);
						return;
					} else if (error.code === 401) {
						// Invalid credentials, reset the token if we were reconnecting to avoid an infinite loop
						authToken = null;
					}

					// Authentication was rejected
					socket.disconnect();
				} else {
					// Socket was disconnected during the authentication
					logger.info('Socket disconnected during authentication, reconnecting');
					reconnectHandler();
					return;
				}

				reject(error);
			});
	};

	const connectInternal = (resolve, reject, authenticationHandler, reconnectOnFailure = true) => {
		ws = new WebSocketImpl((options.secure ? 'wss://' : 'ws://') + options.url);

		const scheduleReconnect = () => {
			if (!reconnectOnFailure) {
				reject('Cannot connect to the server');
				return;
			}

			reconnectTimer = setTimeout(() => {
				logger.info('Socket reconnecting');
				connectInternal(resolve, reject, authenticationHandler, reconnectOnFailure);
			}, 3000);
		};

		ws.onopen = () => {
			logger.info('Socket connected');

			setSocketHandlers();
			authenticate(resolve, reject, authenticationHandler, scheduleReconnect);
		};

		ws.onerror = (event) => {
			logger.info('Connecting socket failed');
			scheduleReconnect();
		};
	};

	const startConnect = (authenticationHandler, reconnectOnFailure) => {
		return new Promise((resolve, reject) => {
			logger.info('Starting socket connect');
			connectInternal(resolve, reject, authenticationHandler, reconnectOnFailure);
		});
	};

	const isConnected = () => {
		return ws && ws.readyState === ws.OPEN;
	};

	const isReady = () => {
		return isConnected() && !!authToken;
	};

	socket = {
		get nativeSocket() {
			return ws;
		},

		connect(username, password, reconnectOnFailure) {
			return startConnect(() => handleLogin(username, password), reconnectOnFailure);
		},

		reconnect(token) {
			logger.info('Reconnecting socket');
			if (isConnected()) {
				disconnect();
			}

			if (token) {
				authToken = token;
			}

			return startConnect(handleAuthorize);
		},

		disconnect() {
			if (!ws) {
				return Promise.reject('Attempting to disconnect a closed socket');
			}

			logger.info('Disconnecting socket');
			clearTimeout(reconnectTimer);

			//authToken = null;
			ws.close();
		},

		destroy() {
			const resolver = Promise.pending();
			socket.delete(LoginConstants.LOGOUT_URL)
				.then((data) => {
					logger.info('Logout succeed');
					authToken = null;

					resolver.resolve(data);
				})
				.catch((error) => {
					logger.error('Logout failed', error);
					resolver.reject(error);
				});

			return resolver.promise;
		},

		set onConnected(handler) {
			connectedHandler = handler;
		},

		set onDisconnected(handler) {
			disconnectedHandler = handler;
		},

		isConnected,
		isReady,
	};

	return socket;
};

export default ApiSocket;
