'use strict';
import Reflux from 'reflux';
import { PRIVATE_CHAT_SESSIONS_URL, PRIVATE_CHAT_SESSION_URL, MAX_PRIVATE_CHAT_MESSAGES } from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import NotificationActions from 'actions/NotificationActions';

const PrivateChatActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	{ 'fetchSessions': { asyncResult: true } },
	{ 'createSession': { asyncResult: true } },
	{ 'removeSession': { asyncResult: true } },
	{ 'sendMessage': { asyncResult: true } },
	'connectCCPM',
	'disconnectCCPM',
	'setRead',
	'sessionChanged'
]);

PrivateChatActions.fetchSessions.listen(function () {
	let that = this;
	SocketService.get(PRIVATE_CHAT_SESSIONS_URL)
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.fetchMessages.listen(function (cid) {
	let that = this;
	SocketService.get(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/messages/' + MAX_PRIVATE_CHAT_MESSAGES)
		.then((data) => that.completed(cid, data))
		.catch((error) => that.failed(cid, error));
});

PrivateChatActions.connectCCPM.listen(function (cid) {
	let that = this;
	SocketService.post(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/ccpm')
		.then(that.completed)
		.catch(this.failed);
});

PrivateChatActions.disconnectCCPM.listen(function (cid) {
	let that = this;
	SocketService.delete(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/ccpm')
		.then(that.completed)
		.catch(this.failed);
});

PrivateChatActions.setRead.listen(function (cid) {
	let that = this;
	SocketService.post(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/read')
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.createSession.listen(function (user, location) {
	let session = PrivateChatSessionStore.getSession(user.cid);
	if (session) {
		this.completed(session, user, location);
		return;
	}

	let that = this;
	SocketService.post(PRIVATE_CHAT_SESSION_URL, { 
		cid: user.cid,
		hub_url: user.hub_url
	})
		.then((data) => that.completed(data, user, location))
		.catch(that.failed);
});

PrivateChatActions.createSession.completed.listen(function (data, user, location) {
	History.pushSidebar(location, 'messages/session/' + user.cid);
});

PrivateChatActions.createSession.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to create chat session',
		message: error.message
	});
});

PrivateChatActions.removeSession.listen(function (cid) {
	let that = this;
	SocketService.delete(PRIVATE_CHAT_SESSION_URL + '/' + cid)
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.removeSession.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to remove chat session',
		message: error.message
	});
});

PrivateChatActions.sendMessage.listen(function (cid, message) {
	let that = this;
	SocketService.post(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/message', { message: message })
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.sendMessage.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to send message',
		message: error.message
	});
});

export default PrivateChatActions;
