'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const checkFlags = ({ user }) => {
	return user.flags.indexOf('me') === -1 && user.flags.indexOf('hidden') === -1;
};

export const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		filter: checkFlags,
		icon: IconConstants.MESSAGE },
	},
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
		access: AccessConstants.FILELISTS_EDIT, 
		filter: checkFlags,
		icon: IconConstants.FILELIST },
	},
]);

UserActions.message.listen(function (userData, location) {
	PrivateChatActions.createSession(location, userData.user);
});

UserActions.browse.listen(function (userData, location) {
	FilelistActions.createSession(location, userData.user, userData.directory);
});

export default UserActions;
