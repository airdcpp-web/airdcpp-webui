'use strict';
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';
import IconConstants from 'constants/IconConstants';

export default function (actions, sessionUrl, editAccess) {
	const ChatActions = Reflux.createActions([
		{ 'fetchMessages': { asyncResult: true } },
		{ 'sendMessage': { asyncResult: true } },
		{ 'setRead': { asyncResult: true } },
		{ 'clear': { 
			asyncResult: true ,
			displayName: 'Clear chat',
			access: editAccess,
			icon: IconConstants.CLEAR },
		},
		'activeChatChanged',
		'divider'
	]);

	ChatActions.fetchMessages.listen(function (id) {
		let that = this;
		SocketService.get(sessionUrl + '/' + id + '/messages/0')
			.then(that.completed.bind(that, id))
			.catch(that.failed.bind(that, id));
	});

	ChatActions.fetchMessages.failed.listen(function (id, error) {
		NotificationActions.apiError('Failed to fetch chat messages', error, id);
	});

	ChatActions.setRead.listen(function (id) {
		let that = this;
		SocketService.post(sessionUrl + '/' + id + '/messages/read')
			.then(that.completed)
			.catch(that.failed);
	});

	ChatActions.clear.listen(function (session) {
		let that = this;
		SocketService.delete(sessionUrl + '/' + session.id + '/messages')
			.then(that.completed.bind(that, session))
			.catch(that.failed.bind(that, session));
	});

	ChatActions.clear.failed.listen(function (session, error) {
		NotificationActions.apiError('Failed to clear chat messages', error, session.id);
	});


	ChatActions.sendMessage.listen(function (session, text, thirdPerson = false) {
		let that = this;
		SocketService.post(sessionUrl + '/' + session.id + '/chat_message', { 
			text,
			third_person: thirdPerson,
		})
			.then(that.completed.bind(that, session))
			.catch(that.failed.bind(that, session));
	});

	ChatActions.sendMessage.failed.listen(function (session, error) {
		NotificationActions.apiError('Failed to send chat message', error, session.id);
	});

	return Object.assign(actions, ChatActions);
}