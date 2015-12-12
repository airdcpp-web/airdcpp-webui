'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';

import IconConstants from 'constants/IconConstants';

export const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		icon: IconConstants.MESSAGE },
	},
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
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
