'use strict';
import Reflux from 'reflux';
import LogConstants from 'constants/LogConstants';
import SocketService from 'services/SocketService';

export const LogActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	{ 'fetchInfo': { asyncResult: true } },
	'clear',
	'setRead',
	'setActive',
	'resetLogCounters'
]);

LogActions.fetchInfo.listen(function () {
	let that = this;
	return SocketService.get(LogConstants.INFO_URL)
		.then(that.completed)
		.catch(that.failed);
});

LogActions.fetchMessages.listen(function () {
	let that = this;
	return SocketService.get(LogConstants.GET_URL + '/0')
		.then(that.completed)
		.catch(that.failed);
});

LogActions.clear.listen(function () {
	return SocketService.post(LogConstants.CLEAR_URL);
});

LogActions.setRead.listen(function () {
	return SocketService.post(LogConstants.READ_URL);
});

export default LogActions;
