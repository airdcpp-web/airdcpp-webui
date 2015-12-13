'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


export const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		access: AccessConstants.PRIVATE_CHAT_EDIT, 
		icon: IconConstants.MESSAGE },
	},
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
		access: AccessConstants.FILELISTS_EDIT, 
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
