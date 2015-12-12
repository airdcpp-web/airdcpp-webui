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
	return SocketService.get(LogConstants.LOG_GET_URL + '/' + LogConstants.MAX_LOG_MESSAGES)
		.then(that.completed)
		.catch(this.failed);
});

LogActions.clear.listen(function () {
	//let that = this;
	return SocketService.post(LogConstants.LOG_CLEAR_URL);
	//	.then(that.completed)
	//	.catch(this.failed);
});

LogActions.messagesRead.listen(function () {
	//let that = this;
	return SocketService.post(LogConstants.LOG_READ_URL);
	//	.then(that.completed)
	//	.catch(this.failed);
});

export default LogActions;
