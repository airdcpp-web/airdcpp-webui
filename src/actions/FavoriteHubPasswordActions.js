'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import { PasswordDialog } from 'components/semantic/InputDialog';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const sendPassword = (hub, password, action) => {
	return SocketService.patch(FavoriteHubConstants.HUB_URL + '/' + hub.id, { password: password })
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
		access: AccessConstants.FAVORITE_HUBS_EDIT, 
		icon: IconConstants.LOCK },
	},
	{ 'change': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Change password',
		access: AccessConstants.FAVORITE_HUBS_EDIT, 
		icon: IconConstants.EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove password',
		access: AccessConstants.FAVORITE_HUBS_EDIT, 
		icon: IconConstants.REMOVE },
	},
]);

FavoriteHubPasswordActions.create.listen(function (hub) {
	const text = 'Set password for the hub ' + hub.name;
	PasswordDialog('Set password', text, this.saved.bind(this, hub));
});

FavoriteHubPasswordActions.create.saved.listen(function (hub, password) {
	sendPassword(hub, password, FavoriteHubPasswordActions.create);
});

FavoriteHubPasswordActions.change.listen(function (hub) {
	const text = 'Enter new password for the hub ' + hub.name;
	PasswordDialog('Change password', text, this.saved.bind(this, hub));
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

	ConfirmDialog(options, this.confirmed.bind(this, hub));
});

FavoriteHubPasswordActions.remove.confirmed.listen(function (hub) {
	sendPassword(hub, null, FavoriteHubPasswordActions.remove);
});

export default FavoriteHubPasswordActions;
