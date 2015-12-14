'use strict';
import Reflux from 'reflux';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import NotificationActions from 'actions/NotificationActions';
import ChatActionDecorator from 'decorators/ChatActionDecorator';

const PrivateChatActions = Reflux.createActions([
	{ 'fetchSessions': { asyncResult: true } },
	{ 'createSession': { asyncResult: true } },
	{ 'removeSession': { asyncResult: true } },
	'connectCCPM',
	'disconnectCCPM',
	'sessionChanged'
]);

PrivateChatActions.fetchSessions.listen(function () {
	let that = this;
	SocketService.get(PrivateChatConstants.SESSIONS_URL)
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.connectCCPM.listen(function (cid) {
	let that = this;
	SocketService.post(PrivateChatConstants.SESSION_URL + '/' + cid + '/ccpm')
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.disconnectCCPM.listen(function (cid) {
	let that = this;
	SocketService.delete(PrivateChatConstants.SESSION_URL + '/' + cid + '/ccpm')
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.createSession.listen(function (location, user) {
	let session = PrivateChatSessionStore.getSession(user.cid);
	if (session) {
		this.completed(location, user, session);
		return;
	}

	let that = this;
	SocketService.post(PrivateChatConstants.SESSION_URL, {
		user: {
			cid: user.cid,
			hub_url: user.hub_url,
		}
	})
		.then(that.completed.bind(that, location, user))
		.catch(that.failed);
});

PrivateChatActions.createSession.completed.listen(function (location, user, session) {
	History.pushSidebar(location, '/messages/session/' + user.cid, { pending: true });
});

PrivateChatActions.createSession.failed.listen(function (error) {
	NotificationActions.apiError('Failed to create chat session', error);
});

PrivateChatActions.removeSession.listen(function (cid) {
	let that = this;
	SocketService.delete(PrivateChatConstants.SESSION_URL + '/' + cid)
		.then(that.completed)
		.catch(that.failed.bind(that, cid));
});

PrivateChatActions.removeSession.failed.listen(function (cid, error) {
	NotificationActions.apiError('Failed to remove chat session', error, cid);
});

export default ChatActionDecorator(PrivateChatActions, PrivateChatConstants.SESSION_URL);
