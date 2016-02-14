import invariant from 'invariant';
import Promise from 'utils/Promise';


const SocketRequestHandler = (socket, logger, options) => {
	let callbacks = {};
	let currentCallbackId = 0;

	// Internal

	// This creates a new callback ID for a request
	const getCallbackId = () => {
		currentCallbackId += 1;
		if (currentCallbackId > 10000) {
			currentCallbackId = 0;
		}

		return currentCallbackId;
	};

	const sendRequest = (path, data, method, authenticating) => {
		if (!socket.isConnected()) {
			logger.warn('Attempting to send request on a closed socket: ' + path);
			return Promise.reject('No socket');
		}

		if (!authenticating && !socket.isReady()) {
			logger.warn('Attempting to send request on a non-authenticated socket: ' + path);
			return Promise.reject('Not authorized');
		}

		invariant(path, 'Attempting socket request without a path');

		const resolver = Promise.pending();
		const callbackId = getCallbackId();

		callbacks[callbackId] = {
			time: new Date(),
			resolver,
		};

		logger.verbose(callbackId, method, path, data ? data : '(no data)');

		const request = {
			path,
			method,
			data,
			callback_id: callbackId,
		};

		socket.nativeSocket.send(JSON.stringify(request));
		return resolver.promise;
	};


	// Public
	socket.put = (path, data) => {
		return sendRequest(path, data, 'PUT');
	};

	socket.patch = (path, data) => {
		return sendRequest(path, data, 'PATCH');
	};

	socket.post = (path, data, authenticating) => {
		return sendRequest(path, data, 'POST', authenticating);
	};

	socket.delete = (path, data) => {
		invariant(!data, 'No data is allowed for delete command');
		return sendRequest(path, null, 'DELETE');
	};

	socket.get = (path, data) => {
		invariant(!data, 'No data is allowed for get command');
		return sendRequest(path, null, 'GET');
	};

	// Shared for the socket
	return {
		onSocketDisconnected() {
			// Clear callbacks
			Object.keys(callbacks).forEach(id => callbacks[id].resolver.reject({ message: 'Socket disconnected' }));
			callbacks = {};
		},

		handleMessage(messageObj) {
			const id = messageObj.callback_id;
			if (!callbacks.hasOwnProperty(id)) {
				logger.warn('No pending request for an API response', id, messageObj);
				return;
			}

			if (messageObj.code >= 200 && messageObj.code <= 204) {
				logger.verbose(id, 'SUCCEED', messageObj.data ? messageObj.data : '(no data)');
				callbacks[id].resolver.resolve(messageObj.data);
			} else {
				invariant(messageObj.error, 'Invalid error response received from the API');
				logger.warn(id, messageObj.code, messageObj.error.message);
				
				callbacks[id].resolver.reject({ 
					message: messageObj.error.message, 
					code: messageObj.code, 
					json: messageObj.error 
				});
			}

			delete callbacks[id];
		},
	};
};

export default SocketRequestHandler;