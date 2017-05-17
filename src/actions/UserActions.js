'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';
import NotificationActions from 'actions/NotificationActions';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';


const checkFlags = ({ user }) => {
	return user.flags.indexOf('self') === -1 && user.flags.indexOf('hidden') === -1;
};

const checkIgnore = ({ user }) => {
	return (user.flags.indexOf('op') === -1 || user.flags.indexOf('bot') !== -1) && 
		 user.flags.indexOf('ignored') === -1 &&
		 checkFlags({ user });
};

const checkUnignore = ({ user }) => {
	return user.flags.indexOf('ignored') !== -1;
};

export const UserFileActions = [ 'message', 'browse' ];

const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		filter: checkFlags,
		icon: IconConstants.MESSAGE,
	} },
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
		access: AccessConstants.FILELISTS_EDIT, 
		filter: checkFlags,
		icon: IconConstants.FILELIST,
	} },
	'divider',
	{ 'ignore': { 
		asyncResult: true,	
		displayName: 'Ignore messages', 
		access: AccessConstants.SETTINGS_EDIT, 
		filter: checkIgnore,
		icon: 'red ban',
	} },
	{ 'unignore': { 
		asyncResult: true,	
		displayName: 'Unignore messages', 
		access: AccessConstants.SETTINGS_EDIT, 
		filter: checkUnignore,
		icon: 'ban',
	} },
]);

UserActions.message.listen(function (userData, location) {
	PrivateChatActions.createSession(location, userData.user, PrivateChatSessionStore);
});

UserActions.browse.listen(function (userData, location) {
	FilelistSessionActions.createSession(location, userData.user, FilelistSessionStore, userData.directory);
});

UserActions.ignore.listen(function (userData, location) {
	let that = this;
	return SocketService.post(UserConstants.IGNORES_URL + '/' + userData.user.cid)
		.then(that.completed.bind(that, userData))
		.catch(that.failed);
});

UserActions.unignore.listen(function (userData, location) {
	let that = this;
	return SocketService.delete(UserConstants.IGNORES_URL + '/' + userData.user.cid)
		.then(that.completed.bind(that, userData))
		.catch(that.failed);
});

UserActions.ignore.completed.listen(function (userData) {
	NotificationActions.info({ 
		title: userData.user.nick ? userData.user.nick : userData.user.nicks,
		uid: userData.user.cid,
		message: 'User was added in ignored users',
	});
});

UserActions.unignore.completed.listen(function (userData) {
	NotificationActions.info({ 
		title: userData.user.nick ? userData.user.nick : userData.user.nicks,
		uid: userData.user.cid,
		message: 'User was removed from ignored users',
	});
});

export default UserActions;
