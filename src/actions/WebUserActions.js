'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import OverlayConstants from 'constants/OverlayConstants';
import WebUserConstants from 'constants/WebUserConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/LoginStore';

const isOther = (user) => {
	return user.username !== LoginStore.user;
};

const WebUserActions = Reflux.createActions([
	{ 'create': { 
		displayName: 'Add user',
		icon: IconConstants.CREATE },
	},
	{ 'edit': { 
		displayName: 'Edit user', 
		//filter: isOther,
		icon: IconConstants.EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove user', 
		filter: isOther,
		icon: IconConstants.REMOVE },
	},
]);

WebUserActions.create.listen(function (location) {
	History.pushModal(location, location.pathname + '/user', OverlayConstants.WEB_USER_MODAL_ID);
});

WebUserActions.edit.listen(function (user, location) {
	History.pushModal(location, location.pathname + '/user', OverlayConstants.WEB_USER_MODAL_ID, { user: user });
});

WebUserActions.remove.listen(function (user) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the user ' + user.username + '?',
		icon: this.icon,
		approveCaption: 'Remove user',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options, this.confirmed.bind(this, user));
});

WebUserActions.remove.confirmed.listen(function (user) {
	const that = this;
	return SocketService.post(WebUserConstants.USER_DELETE_URL, { username: user.username })
		.then(WebUserActions.remove.completed.bind(that, user))
		.catch(WebUserActions.remove.failed.bind(that, user));
});

export default WebUserActions;
