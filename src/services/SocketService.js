import SocketStore from 'stores/SocketStore.js';
import ApiSocket from 'utils/ApiSocket';

import invariant from 'invariant';


const sendCommand = (path, data, method) => {
	invariant(path, 'SocketService, path missing');
	if (!SocketStore.socket) {
		console.log(method + ' for a closed socket: ' + path);
		return Promise.reject('No socket');
	}

	return SocketStore.socket.sendRequest(path, data, method);
};

const getApiUrl = () => {
	return (window.location.protocol == 'https:' ? 'wss://' : 'ws://') + window.location.host + '/';
};

const SocketService = {
	connect(username, password) {
		invariant(!SocketStore.socket, 'Attempting socket connect while a socket exists');

		let socket = new ApiSocket(getApiUrl());
		return socket.connect(username, password, true);
	},

	reconnect(token) {
		if (SocketStore.socket) {
			console.log('Reconnect, disconnecting an existing socket');
			SocketStore.socket.disconnect();
		}

		let socket = new ApiSocket(getApiUrl());
		return socket.reconnect(token);
	},

	disconnect() {
		if (!SocketStore.socket) {
			console.log('Disconnect for a closed socket');
			return;
		}

		SocketStore.socket.disconnect();
	},

	put(path, data) {
		return sendCommand(path, data, 'PUT');
	},

	patch(path, data) {
		return sendCommand(path, data, 'PATCH');
	},

	post(path, data) {
		return sendCommand(path, data, 'POST');
	},

	delete(path, data) {
		invariant(!data, 'No data is allowed for delete command');
		return sendCommand(path, null, 'DELETE');
	},

	get(path, data) {
		invariant(!data, 'No data is allowed for get command');
		return sendCommand(path, null, 'GET');
	},
};

export default SocketService;
