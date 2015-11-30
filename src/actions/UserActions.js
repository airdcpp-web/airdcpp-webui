'use strict';
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';

import { ICON_FILELIST, ICON_MESSAGE } from 'constants/IconConstants';

export const UserActions = Reflux.createActions([
	 { 'message': { 
		asyncResult: true, 
		displayName: 'Send message', 
		icon: ICON_MESSAGE },
	},
	{ 'browse': { 
		asyncResult: true,	
		displayName: 'Browse share', 
		icon: ICON_FILELIST },
	},
]);

UserActions.message.listen(function (userData, location) {
	PrivateChatActions.createSession(location, userData.user);
});

UserActions.browse.listen(function (userData, location) {
	FilelistActions.createSession(location, userData.user, userData.directory);
});

export default UserActions;
