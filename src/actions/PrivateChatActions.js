'use strict';
import Reflux from 'reflux';
import PrivateChatConstants from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import NotificationActions from 'actions/NotificationActions';
import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';

import ChatActionDecorator from 'decorators/action/ChatActionDecorator';
import SessionActionDecorator from 'decorators/action/SessionActionDecorator';


const PrivateChatActions = Reflux.createActions([
	{ 'createSession': { asyncResult: true } },
	{ 'connectCCPM': { 
		asyncResult: true,
		displayName: 'Connect',
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		icon: IconConstants.PLAY,
	} },
	{ 'disconnectCCPM': { 
		asyncResult: true,
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		displayName: 'Disconnect', 
		icon: IconConstants.REMOVE,
	} },
]);

PrivateChatActions.connectCCPM.listen(function (session) {
	let that = this;
	SocketService.post(PrivateChatConstants.SESSION_URL + '/' + session.id + '/ccpm')
		.then(that.completed)
		.catch(that.failed);
});

PrivateChatActions.disconnectCCPM.listen(function (session) {
	let that = this;
	SocketService.delete(PrivateChatConstants.SESSION_URL + '/' + session.id + '/ccpm')
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

export default SessionActionDecorator(
	ChatActionDecorator(PrivateChatActions, PrivateChatConstants.SESSION_URL), PrivateChatConstants.MODULE_URL, AccessConstants.PRIVATE_CHAT_EDIT
);
