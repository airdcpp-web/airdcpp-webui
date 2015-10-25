'use strict';
import Reflux from 'reflux';
import SocketService from 'services/SocketService'
import SocketStore from 'stores/SocketStore'
import {LOGIN_URL, CONNECT_URL, LOGOUT_URL} from 'constants/LoginConstants';

export const LoginActions = Reflux.createActions([
	{ "login": { asyncResult: true} },
	{ "connect": { asyncResult: true} },
	{ "logout": { asyncResult: true} }
]);

LoginActions.login.listen(function(username, password) {
	let that = this;

	SocketService.connect();
	let unsubscribe = SocketStore.listen((socket, error) => {
		if (socket) {
			SocketService.post(LOGIN_URL, { username: username, password: password })
				.then(that.completed)
				.catch(that.failed);
		} else {
			that.failed(error);
		}

		unsubscribe();
	});
});

LoginActions.connect.listen(function(token) {
	let that = this;

	SocketService.reconnect();
	let unsubscribe = SocketStore.listen((socket, error) => {
		if (socket) {
			SocketService.post(CONNECT_URL, { authorization: token })
				.then(that.completed)
				.catch(that.failed);

				unsubscribe();
		}
	});
});

LoginActions.logout.listen(function() {
	let that = this;
	return SocketService.delete(LOGOUT_URL)
		.then(that.completed)
		.catch(this.failed);
});

LoginActions.logout.completed.listen(function() {
	SocketService.disconnect();
});


export default LoginActions;