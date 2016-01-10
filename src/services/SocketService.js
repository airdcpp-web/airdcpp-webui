import SocketStore from 'stores/SocketStore.js';
import ApiSocket from 'utils/ApiSocket';

import invariant from 'invariant';


const sendCommand = (data, path, method) => {
	invariant(path, 'SocketService, path missing');
	if (!SocketStore.socket) {
		console.log(method + ' for a closed socket: ' + path);
		return Promise.reject('No socket');
	}

	return SocketStore.socket.sendRequest(data, path, method);
};

const SocketService = {
	connect() {
		let socket = new ApiSocket();
		return socket.connect(false);
	},

	reconnect() {
		let socket = new ApiSocket();
		return socket.connect(true);
	},

	disconnect() {
		if (!SocketStore.socket) {
			console.log('Disconnect for a closed socket: ' + path);
			return Promise.reject('No socket');
		}

		SocketStore.socket.disconnect();
	},

	put(path, data) {
		return sendCommand(data, path, 'PUT');
	},

	patch(path, data) {
		return sendCommand(data, path, 'PATCH');
	},

	post(path, data) {
		return sendCommand(data, path, 'POST');
	},

	delete(path, data) {
		invariant(!data, 'No data is allowed for delete command');
		return sendCommand(null, path, 'DELETE');
	},

	get(path, data) {
		invariant(!data, 'No data is allowed for delete command');
		return sendCommand(null, path, 'GET');
	},
};

export default SocketService;
