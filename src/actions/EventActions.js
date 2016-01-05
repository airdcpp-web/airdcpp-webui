'use strict';
import Reflux from 'reflux';
import EventConstants from 'constants/EventConstants';
import SocketService from 'services/SocketService';

export const EventActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	{ 'fetchInfo': { asyncResult: true } },
	'clear',
	'setRead',
	'setActive',
	'resetLogCounters'
]);

EventActions.fetchInfo.listen(function () {
	let that = this;
	return SocketService.get(EventConstants.INFO_URL)
		.then(that.completed)
		.catch(that.failed);
});

EventActions.fetchMessages.listen(function () {
	let that = this;
	return SocketService.get(EventConstants.GET_URL + '/0')
		.then(that.completed)
		.catch(that.failed);
});

EventActions.clear.listen(function () {
	return SocketService.post(EventConstants.CLEAR_URL);
});

EventActions.setRead.listen(function () {
	return SocketService.post(EventConstants.READ_URL);
});

export default EventActions;
