'use strict';
import Reflux from 'reflux';
import { HUB_SESSIONS_URL, HUB_SESSION_URL, MAX_HUB_CHAT_MESSAGES } from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import HubSessionStore from 'stores/HubSessionStore';
import NotificationActions from 'actions/NotificationActions';
import ChatActionDecorator from 'decorators/ChatActionDecorator';

import { ICON_FAVORITE, ICON_REFRESH } from 'constants/IconConstants';

const HubActions = Reflux.createActions([
	{ 'fetchSessions': { asyncResult: true } },
	{ 'createSession': { asyncResult: true } },
	{ 'removeSession': { asyncResult: true } },
	{ 'redirect': { asyncResult: true } },
	{ 'password': { asyncResult: true } },
	{ 'reconnect': { 
		asyncResult: true,
		displayName: 'Reconnect', 
		icon: ICON_REFRESH } 
	},
	{ 'favorite': { 
		asyncResult: true,
		displayName: 'Add to favorites', 
		icon: ICON_FAVORITE } 
	},
	'sessionChanged',
]);

HubActions.fetchSessions.listen(function () {
	let that = this;
	SocketService.get(HUB_SESSIONS_URL)
		.then(that.completed)
		.catch(that.failed);
});

HubActions.password.listen(function (hub, password) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/password', { password: password })
		.then(that.completed.bind(that, hub))
		.catch(that.failed.bind(that, hub));
});

HubActions.redirect.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/redirect')
		.then(that.completed.bind(that, hub))
		.catch(that.failed.bind(that, hub));
});

HubActions.favorite.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/favorite')
		.then(that.completed.bind(that, hub))
		.catch(that.failed.bind(that, hub));
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
		message: error.message,
	});		
});

HubActions.reconnect.listen(function (hub) {
	let that = this;
	SocketService.post(HUB_SESSION_URL + '/' + hub.id + '/reconnect')
		.then(that.completed)
		.catch(this.failed);
});

HubActions.createSession.listen(function (location, hubUrl) {
	let session = HubSessionStore.getSession(hubUrl);
	if (session) {
		this.completed(location, session);
		return;
	}

	let that = this;
	SocketService.post(HUB_SESSION_URL, {
		hub_url: hubUrl,
	})
		.then(that.completed.bind(that, location))
		.catch(that.failed);
});

HubActions.createSession.completed.listen(function (location, session) {
	History.pushSidebar(location, 'hubs/session/' + session.id, { pending: true });
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
		.then(that.completed.bind(that, id))
		.catch(that.failed.bind(that, id));
});

HubActions.removeSession.failed.listen(function (id, error) {
	NotificationActions.error({ 
		title: 'Failed to remove hub session',
		message: error.message,
	});
});

export default ChatActionDecorator(HubActions, HUB_SESSION_URL, MAX_HUB_CHAT_MESSAGES);
