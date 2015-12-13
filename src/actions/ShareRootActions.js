'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import OverlayConstants from 'constants/OverlayConstants';
import ShareRootConstants from 'constants/ShareRootConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

const ShareRootActions = Reflux.createActions([
	{ 'create': { 
		displayName: 'Add directory',
		icon: IconConstants.CREATE },
	},
	{ 'edit': { 
		displayName: 'Edit directory', 
		icon: IconConstants.EDIT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove directory', 
		icon: IconConstants.REMOVE },
	},
]);

ShareRootActions.create.listen(function (location) {
	History.pushModal(location, location.pathname + '/root', OverlayConstants.SHARE_ROOT_MODAL_ID);
});

ShareRootActions.edit.listen(function (root, location) {
	History.pushModal(location, location.pathname + '/root', OverlayConstants.SHARE_ROOT_MODAL_ID, { rootEntry: root });
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
	return SocketService.post(ShareRootConstants.ROOT_DELETE_URL, { path: root.path })
		.then(ShareRootActions.remove.completed.bind(that, root))
		.catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
