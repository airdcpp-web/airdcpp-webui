'use strict';
import Reflux from 'reflux';
import { LOG_GET_URL, LOG_CLEAR_URL, LOG_READ_URL, MAX_LOG_MESSAGES } from 'constants/LogConstants';
import SocketService from 'services/SocketService';

export const LogActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	'clear',
	'messagesRead',
	'resetLogCounters'
]);

LogActions.fetchMessages.listen(function () {
	let that = this;
	return SocketService.get(LOG_GET_URL + '/' + MAX_LOG_MESSAGES)
		.then(that.completed)
		.catch(this.failed);
});

LogActions.clear.listen(function () {
	let that = this;
	return SocketService.post(LOG_CLEAR_URL)
		.then(that.completed)
		.catch(this.failed);
});

LogActions.messagesRead.listen(function () {
	let that = this;
	return SocketService.post(LOG_READ_URL)
		.then(that.completed)
		.catch(this.failed);
});

export default LogActions;
