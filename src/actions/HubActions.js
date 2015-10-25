'use strict';
import Reflux from 'reflux';
import { HUB_SESSIONS_URL, HUB_SESSION_URL, MAX_HUB_CHAT_MESSAGES } from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import HubSessionStore from 'stores/HubSessionStore';
import NotificationActions from 'actions/NotificationActions';

const HubActions = Reflux.createActions([
	{ 'fetchMessages': { asyncResult: true } },
	{ 'fetchSessions': { asyncResult: true } },
	{ 'createSession': { asyncResult: true } },
	{ 'removeSession': { asyncResult: true } },
	{ 'sendMessage': { asyncResult: true } },
	{ 'redirect': { asyncResult: true } },
	{ 'password': { asyncResult: true } },
	{ 'reconnect': { 
		asyncResult: true,
		displayName: 'Reconnect', 
		icon: 'green refresh' } },
	{ 'favorite': { 
		asyncResult: true,
		displayName: 'Add to favorites', 
		icon: 'yellow star' } },
	'setRead',
	'sessionChanged',
]);

HubActions.fetchSessions.listen(function () {
	let that = this;
	SocketService.get(HUB_SESSIONS_URL)
		.then(that.completed)
		.catch(that.failed);
});

HubActions.fetchMessages.listen(function (id) {
	let that = this;
	SocketService.get(HUB_SESSION_URL + '/' + id + '/messages/' + MAX_HUB_CHAT_MESSAGES)
		.then((data) => that.completed(id, data))
		.catch((error) => that.failed(id, error));
});

HubActions.password.listen(function (hub, password) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/password', { password: password })
		.then(data => that.completed(hub, data))
		.catch(error => that.failed(hub, error));
});

HubActions.redirect.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/redirect')
		.then(data => that.completed(hub, data))
		.catch(error => that.failed(hub, error));
});

HubActions.favorite.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/favorite')
		.then(data => that.completed(hub, data))
		.catch(error => that.failed(hub, error));
});

HubActions.favorite.completed.listen(function (hub) {
	NotificationActions.success({ 
		title: hub.identity.name,
		message: 'The hub has been added in favorites',
	});		
});

HubActions.favorite.failed.listen(function (hub, error) {
	NotificationActions.error({ 
		title: hub.identity.name,
		message: error.reason,
	});		
});

HubActions.reconnect.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/reconnect')
		.then(that.completed)
		.catch(this.failed);
});

HubActions.setRead.listen(function (id) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + id + '/read')
		.then(that.completed)
		.catch(that.failed);
});

HubActions.createSession.listen(function (hubUrl, location) {
	let session = HubSessionStore.getSession(hubUrl);
	if (session) {
		this.completed(session, location);
		return;
	}

	let that = this;
	SocketService.post(HUB_SESSION_URL, {
		hub_url: hubUrl,
	})
		.then((data) => that.completed(data, location))
		.catch(that.failed);
});

HubActions.createSession.completed.listen(function (data, location) {
	History.pushSidebar(location, 'hubs/session/' + data.id);
});

HubActions.createSession.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to create hub session',
		message: error.message,
	});
});

HubActions.removeSession.listen(function (id) {
	let that = this;
	SocketService.delete(HUB_SESSION_URL + '/' + id)
		.then(that.completed)
		.catch(that.failed);
});

HubActions.removeSession.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to remove hub session',
		message: error.message,
	});
});

HubActions.sendMessage.listen(function (id, message) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + id + '/message', { message: message })
		.then(that.completed)
		.catch(that.failed);
});

HubActions.sendMessage.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Failed to send message',
		message: error.message,
	});
});

export default HubActions;
