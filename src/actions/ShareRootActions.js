'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import History from 'utils/History';

import OverlayConstants from 'constants/OverlayConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

const ShareRootActions = Reflux.createActions([
	{ 'create': { 
		displayName: 'Add directory',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.CREATE },
	},
	{ 'edit': { 
		displayName: 'Edit directory',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove directory',
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.REMOVE },
	},
]);

ShareRootActions.create.listen(function (data, location) {
	History.pushModal(location, location.pathname + '/add', OverlayConstants.SHARE_ROOT_MODAL_ID);
});

ShareRootActions.edit.listen(function (root, location) {
	History.pushModal(location, location.pathname + '/edit', OverlayConstants.SHARE_ROOT_MODAL_ID, { rootEntry: root });
});

ShareRootActions.remove.listen(function (root) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the directory ' + root.virtual_name + ' from share? It will be removed from all share profiles.',
		icon: this.icon,
		approveCaption: 'Remove directory',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options, this.confirmed.bind(this, root));
});

ShareRootActions.remove.confirmed.listen(function (root) {
	const that = this;
	return SocketService.delete(ShareRootConstants.ROOTS_URL + '/' + root.id)
		.then(ShareRootActions.remove.completed.bind(that, root))
		.catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
