'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import { SHARE_ROOT_MODAL_ID } from 'constants/OverlayConstants';
import { SHARE_ROOT_URL } from 'constants/ShareConstants';

import History from 'utils/History';


const ShareRootActions = Reflux.createActions([
	{ 'create': { 
		displayName: 'Add directory',
		icon: 'green folder' },
	},
	{ 'edit': { 
		displayName: 'Edit directory', 
		icon: 'edit' },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove directory', 
		icon: 'red remove circle' },
	},
]);

ShareRootActions.create.listen(function (location) {
	History.pushModal(location, location.pathname + '/root', SHARE_ROOT_MODAL_ID);
});

ShareRootActions.edit.listen(function (root, location) {
	History.pushModal(location, location.pathname + '/root', SHARE_ROOT_MODAL_ID, { rootEntry: root });
});

ShareRootActions.remove.listen(function (root) {
	const text = 'Are you sure that you want to remove the directory ' + root.virtual_name + '?';
	ConfirmDialog('Remove directory', text, this.icon, 'Remove directory', "Don't remove").then(() => this.confirmed(root));
});

ShareRootActions.remove.confirmed.listen(function (root) {
	const that = this;
	return SocketService.delete(SHARE_ROOT_URL, { path: root.path })
		.then(ShareRootActions.remove.completed.bind(that, root))
		.catch(ShareRootActions.remove.failed.bind(that, root));
});

export default ShareRootActions;
