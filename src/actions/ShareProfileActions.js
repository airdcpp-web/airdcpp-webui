'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import InputDialog from 'components/semantic/InputDialog';
import ConfirmDialog from 'components/semantic/ConfirmDialog';

import { SHARE_PROFILE_URL } from 'constants/ShareConstants';

const ShareProfileActions = Reflux.createActions([
	{ 'create': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Add profile',
		icon: 'green tasks' },
	},
	{ 'edit': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Rename profile', 
		icon: 'edit' },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove profile', 
		icon: 'red remove circle' },
	},
]);

ShareProfileActions.create.listen(function () {
	const options = {
		icon: this.icon,
		approveCaption: 'Create',
		title: 'Create profile',
		text: 'Enter name for the profile',
		placeholder: 'Enter name',
	};

	InputDialog(options)
		.then(ShareProfileActions.create.saved)
		.catch(() => {});
});

ShareProfileActions.create.saved.listen(function (name) {
	const that = this;
	return SocketService.post(SHARE_PROFILE_URL, { name: name })
		.then(that.completed.bind(profile))
		.catch(that.failed.bind(profile));
});

ShareProfileActions.edit.listen(function (profile) {
	const options = {
		icon: this.icon,
		approveCaption: 'Rename',
		title: 'Rename profile',
		text: 'Enter new name for the profile ' + profile.name,
		placeholder: 'Enter name',
	};

	InputDialog(options)
		.then((name) => ShareProfileActions.edit.saved(profile, name))
		.catch(() => {});
});

ShareProfileActions.edit.saved.listen(function (profile, name) {
	const that = this;
	return SocketService.patch(SHARE_PROFILE_URL + '/' + profile.id, { name: name })
		.then(that.completed.bind(profile))
		.catch(that.failed.bind(profile));
});

ShareProfileActions.remove.listen(function (profile) {
	const text = 'Are you sure that you want to remove the profile ' + profile.name + '?';
	ConfirmDialog('Remove profile', text, this.icon, 'Remove profile', "Don't remove").then(() => this.confirmed(profile));
});

ShareProfileActions.remove.confirmed.listen(function (profile) {
	const that = this;
	return SocketService.delete(SHARE_PROFILE_URL + '/' + profile.id)
		.then(that.completed.bind(profile))
		.catch(that.failed.bind(profile));
});

export default ShareProfileActions;
