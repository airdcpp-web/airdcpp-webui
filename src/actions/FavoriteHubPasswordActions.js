'use strict';
import Reflux from 'reflux';

import { FAVORITE_HUB_URL } from 'constants/FavoriteHubConstants';
import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import { PasswordDialog } from 'components/semantic/InputDialog';
import { ICON_LOCK, ICON_EDIT, ICON_REMOVE } from 'constants/IconConstants';

const sendPassword = (hub, password, action) => {
	return SocketService.patch(FAVORITE_HUB_URL + '/' + hub.id, { password: password })
		.then(() => 
			action.completed(hub))
		.catch((error) => 
			action.failed(hub, error)
		);
};

const FavoriteHubPasswordActions = Reflux.createActions([
	{ 'create': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Set password',
		icon: ICON_LOCK },
	},
	{ 'change': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Change password', 
		icon: ICON_EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove password', 
		icon: ICON_REMOVE },
	},
]);

FavoriteHubPasswordActions.create.listen(function (hub) {
	const text = 'Set password for the hub ' + hub.name;
	PasswordDialog('Set password', text)
		.then((password) => FavoriteHubPasswordActions.create.saved(hub, password))
		.catch(() => {});
});

FavoriteHubPasswordActions.create.saved.listen(function (hub, password) {
	sendPassword(hub, password, FavoriteHubPasswordActions.create);
});

FavoriteHubPasswordActions.change.listen(function (hub) {
	const text = 'Enter new password for the hub ' + hub.name;
	PasswordDialog('Change password', text)
		.then((password) => FavoriteHubPasswordActions.change.saved(hub, password))
		.catch(() => {});
});

FavoriteHubPasswordActions.change.saved.listen(function (hub, password) {
	sendPassword(hub, password, FavoriteHubPasswordActions.change);
});

FavoriteHubPasswordActions.remove.listen(function (hub) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to reset the password of the hub ' + hub.name + '?',
		icon: this.icon,
		approveCaption: 'Remove password',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options).then(() => this.confirmed(hub));
});

FavoriteHubPasswordActions.remove.confirmed.listen(function (hub) {
	sendPassword(hub, null, FavoriteHubPasswordActions.remove);
});

export default FavoriteHubPasswordActions;
