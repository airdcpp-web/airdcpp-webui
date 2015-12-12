'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import InputDialog from 'components/semantic/InputDialog';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import IconConstants from 'constants/IconConstants';

const ShareProfileActions = Reflux.createActions([
	{ 'create': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Add profile',
		icon: IconConstants.CREATE },
	},
	{ 'edit': { 
		asyncResult: true, 
		children: [ 'saved' ], 
		displayName: 'Rename profile', 
		icon: IconConstants.EDIT },
	},
	{ 'default': { 
		asyncResult: true, 
		displayName: 'Set as default', 
		icon: IconConstants.DEFAULT },
	},
	{ 'remove': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove profile', 
		icon: IconConstants.REMOVE },
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
	return SocketService.post(ShareProfileConstants.PROFILE_URL, { name: name })
		.then(ShareProfileActions.create.completed)
		.catch(ShareProfileActions.create.failed);
});

ShareProfileActions.edit.listen(function (profile) {
	const dialogOptions = {
		icon: this.icon,
		approveCaption: 'Rename',
		title: 'Rename profile',
		content: 'Enter new name for the profile ' + profile.name,
	};

	const inputOptions = {
		placeholder: 'Enter name',
		defaultValue: profile.plain_name,
	};

	InputDialog(dialogOptions, inputOptions)
		.then((name) => ShareProfileActions.edit.saved(profile, name))
		.catch(() => {});
});

ShareProfileActions.default.listen(function (profile) {
	const that = this;
	return SocketService.post(ShareProfileConstants.PROFILE_URL + '/' + profile.id + '/default')
		.then(ShareProfileActions.default.completed.bind(that, profile))
		.catch(ShareProfileActions.default.failed.bind(that, profile));
});

ShareProfileActions.edit.saved.listen(function (profile, name) {
	const that = this;
	return SocketService.patch(ShareProfileConstants.PROFILE_URL + '/' + profile.id, { name: name })
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
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the profile ' + profile.name + '?',
		icon: this.icon,
		approveCaption: 'Remove profile',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options).then(() => this.confirmed(profile));
});

ShareProfileActions.remove.confirmed.listen(function (profile) {
	const that = this;
	return SocketService.delete(ShareProfileConstants.PROFILE_URL + '/' + profile.id)
		.then(ShareProfileActions.remove.completed.bind(that, profile))
		.catch(ShareProfileActions.remove.failed.bind(that, profile));
});

export default ShareProfileActions;
