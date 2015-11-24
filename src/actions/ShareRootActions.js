'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

//import InputDialog from 'components/semantic/InputDialog';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import { SHARE_ROOT_URL } from 'constants/ShareConstants';

const ShareRootActions = Reflux.createActions([
	{ 'create': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Add directory',
		icon: 'green folder' },
	},
	{ 'edit': { 
		asyncResult: true, 
		children: [ 'saved' ], 
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

ShareRootActions.create.listen(function () {
	/*const options = {
		icon: this.icon,
		approveCaption: 'Create',
		title: 'Create profile',
		text: 'Enter name for the profile',
		placeholder: 'Enter name',
	};

	InputDialog(options)
		.then(ShareRootActions.create.saved)
		.catch(() => {});*/
});

ShareRootActions.create.saved.listen(function (name) {
	//return SocketService.post(SHARE_PROFILE_URL, { name: name })
	//	.then(ShareRootActions.create.completed)
	//	.catch(ShareRootActions.create.failed);
});

ShareRootActions.edit.listen(function (profile) {
	
});

ShareRootActions.edit.saved.listen(function (root) {
	/*const that = this;
	return SocketService.patch(SHARE_ROOT_URL, { 
		vi: name,
	})
		.then(ShareRootActions.edit.completed.bind(that, root))
		.catch(ShareRootActions.edit.failed.bind(that, root));*/
});

ShareRootActions.edit.failed.listen(function (root, error) {
	NotificationActions.apiError('Failed to rename directory', error, root.path);
});

ShareRootActions.create.failed.listen(function (error) {
	NotificationActions.apiError('Failed to add directory', error);
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
