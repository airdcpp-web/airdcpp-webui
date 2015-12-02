'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import { SHARE_ROOT_MODAL_ID } from 'constants/OverlayConstants';
import { SHARE_ROOT_DELETE_URL } from 'constants/ShareRootConstants';

import History from 'utils/History';
import { ICON_CREATE, ICON_EDIT, ICON_REMOVE } from 'constants/IconConstants';

const ShareRootActions = Reflux.createActions([
	{ 'create': { 
		displayName: 'Add directory',
		icon: ICON_CREATE },
	},
	{ 'edit': { 
		displayName: 'Edit directory', 
		icon: ICON_EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove directory', 
		icon: ICON_REMOVE },
	},
]);

ShareRootActions.create.listen(function (location) {
	History.pushModal(location, location.pathname + '/root', SHARE_ROOT_MODAL_ID);
});

ShareRootActions.edit.listen(function (root, location) {
	History.pushModal(location, location.pathname + '/root', SHARE_ROOT_MODAL_ID, { rootEntry: root });
});

ShareRootActions.remove.listen(function (root) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the directory ' + root.virtual_name + ' from share? It will be removed from all share profiles.',
		icon: this.icon,
		approveCaption: 'Remove directory',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options).then(() => this.confirmed(root));
});

ShareRootActions.remove.confirmed.listen(function (root) {
	const that = this;
	return SocketService.post(SHARE_ROOT_DELETE_URL, { path: root.path })
		.then(ShareRootActions.remove.completed.bind(that, root))
		.catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
