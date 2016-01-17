'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';


const checkFlags = ({ user }) => {
	return user.flags.indexOf('me') === -1 && user.flags.indexOf('hidden') === -1;
};

const checkIgnore = ({ user }) => {
	return (user.flags.indexOf('op') === -1 || user.flags.indexOf('bot') !== -1) && 
		 user.flags.indexOf('ignored') === -1 &&
		 checkFlags({ user });
};

const checkUnignore = ({ user }) => {
	return user.flags.indexOf('ignored') !== -1;
};

export const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		filter: checkFlags,
		icon: IconConstants.MESSAGE
	} },
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
		access: AccessConstants.FILELISTS_EDIT, 
		filter: checkFlags,
		icon: IconConstants.FILELIST
	} },
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
	PrivateChatActions.createSession(location, userData.user);
});

UserActions.browse.listen(function (userData, location) {
	FilelistActions.createSession(location, userData.user, userData.directory);
});

UserActions.ignore.listen(function (userData, location) {
	let that = this;
	return SocketService.post(UserConstants.IGNORE_URL + '/' + userData.user.cid)
		.then(that.completed)
		.catch(that.failed);
});

UserActions.unignore.listen(function (userData, location) {
	let that = this;
	return SocketService.delete(UserConstants.IGNORE_URL + '/' + userData.user.cid)
		.then(that.completed)
		.catch(that.failed);
});

export default UserActions;
