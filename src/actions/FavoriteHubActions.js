'use strict';
import Reflux from 'reflux';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import OverlayConstants from 'constants/OverlayConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

export const FavoriteHubActions = Reflux.createActions([
	{ 'create': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Add new',
		icon: IconConstants.CREATE },
	},
	{ 'edit': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Edit', 
		icon: IconConstants.EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove', 
		icon: IconConstants.REMOVE },
	},
	{ 'update': { 
		asyncResult: true },
	},
]);

FavoriteHubActions.create.listen(function (hub) {
	History.pushModal('/favorite-hubs', '/favorite-hubs/new', OverlayConstants.FAVORITE_MODAL_ID);
});

FavoriteHubActions.edit.listen(function (hub, data) {
	History.pushModal('/favorite-hubs', '/favorite-hubs/edit', OverlayConstants.FAVORITE_MODAL_ID, { hubEntry: hub });
});

FavoriteHubActions.update.listen(function (hub, data) {
	let that = this;
	return SocketService.patch(FavoriteHubConstants.FAVORITE_HUB_URL + '/' + hub.id, data)
		.then(that.completed)
		.catch(this.failed);
});

FavoriteHubActions.remove.shouldEmit = function (hub) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the favorite hub ' + hub.name + '?',
		icon: this.icon,
		approveCaption: 'Remove favorite hub',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options)
		.then(() => FavoriteHubActions.remove.confirmed(hub))
		.catch(() => {});
	return false;
};

FavoriteHubActions.remove.confirmed.listen(function (hub) {
	return SocketService.delete(FavoriteHubConstants.FAVORITE_HUB_URL + '/' + hub.id)
		.then(() => 
			FavoriteHubActions.remove.completed(hub))
		.catch((error) => 
			FavoriteHubActions.remove.failed(hub, error)
		);
});

FavoriteHubActions.remove.completed.listen(function (hub) {
	NotificationActions.error({ 
		title: hub.name,
		message: 'The hub has been removed successfully',
	});
});

FavoriteHubActions.remove.failed.listen(function (hub, error) {
	NotificationActions.error({ 
		title: hub.name,
		message: 'Failed to remove the hub: ' + error.message,
	});
});

export default FavoriteHubActions;
