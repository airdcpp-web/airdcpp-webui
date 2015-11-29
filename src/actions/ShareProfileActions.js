'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import InputDialog from 'components/semantic/InputDialog';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import { SHARE_PROFILE_URL } from 'constants/ShareProfileConstants';

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
	{ 'default': { 
		asyncResult: true, 
		displayName: 'Set as default', 
		icon: 'blue pin' },
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
	return SocketService.post(SHARE_PROFILE_URL, { name: name })
		.then(ShareProfileActions.create.completed)
		.catch(ShareProfileActions.create.failed);
});

ShareProfileActions.edit.listen(function (profile) {
	const options = {
		icon: this.icon,
		approveCaption: 'Rename',
		title: 'Rename profile',
		text: 'Enter new name for the profile ' + profile.name,
		placeholder: 'Enter name',
		defaultValue: profile.plain_name,
	};

	InputDialog(options)
		.then((name) => ShareProfileActions.edit.saved(profile, name))
		.catch(() => {});
});

ShareProfileActions.default.listen(function (profile) {
	const that = this;
	return SocketService.post(SHARE_PROFILE_URL + '/' + profile.id + '/default')
		.then(ShareProfileActions.default.completed.bind(that, profile))
		.catch(ShareProfileActions.default.failed.bind(that, profile));
});

ShareProfileActions.edit.saved.listen(function (profile, name) {
	const that = this;
	return SocketService.patch(SHARE_PROFILE_URL + '/' + profile.id, { name: name })
		.then(ShareProfileActions.edit.completed.bind(that, profile))
		.catch(ShareProfileActions.edit.failed.bind(that, profile));
});

ShareProfileActions.edit.failed.listen(function (profile, error) {
	NotificationActions.apiError('Failed to rename profile', error, profile.id);
});

ShareProfileActions.create.failed.listen(function (error) {
	NotificationActions.apiError('Failed to create profile', error);
});

ShareProfileActions.remove.listen(function (profile) {
	const text = 'Are you sure that you want to remove the profile ' + profile.name + '?';
	ConfirmDialog('Remove profile', text, this.icon, 'Remove profile', "Don't remove").then(() => this.confirmed(profile));
});

ShareProfileActions.remove.confirmed.listen(function (profile) {
	const that = this;
	return SocketService.delete(SHARE_PROFILE_URL + '/' + profile.id)
		.then(ShareProfileActions.remove.completed.bind(that, profile))
		.catch(ShareProfileActions.remove.failed.bind(that, profile));
});

export default ShareProfileActions;
