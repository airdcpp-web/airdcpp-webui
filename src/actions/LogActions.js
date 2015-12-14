'use strict';
import Reflux from 'reflux';
import LogConstants from 'constants/LogConstants';
import SocketService from 'services/SocketService';

export const LogActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	'clear',
	'messagesRead',
	'resetLogCounters'
]);

LogActions.fetchMessages.listen(function () {
	let that = this;
	return SocketService.get(LogConstants.LOG_GET_URL + '/0')
		.then(that.completed)
		.catch(this.failed);
});

LogActions.clear.listen(function () {
	return SocketService.post(LogConstants.LOG_CLEAR_URL);
});

LogActions.messagesRead.listen(function () {
	return SocketService.post(LogConstants.LOG_READ_URL);
});

export default LogActions;
