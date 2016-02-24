'use strict';
import Reflux from 'reflux';
import { default as QueueConstants } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';
import { PriorityEnum } from 'constants/QueueConstants';
import AccessConstants from 'constants/AccessConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';


const finishedFailed = bundle => bundle.status.failed && bundle.status.finished;

export const QueueActions = Reflux.createActions([
	{ 'searchBundle': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Search for alternates', 
		icon: IconConstants.SEARCH,
	} },
	{ 'setBundlePriority': { 
		asyncResult: true,
		displayName: 'Set priority' 
	} },
	{ 'removeBundle': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.REMOVE,
	} },
	{ 'removeFinished': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Remove finished bundles', 
		icon: IconConstants.REMOVE,
	} },
	{ 'pause': { 
		asyncResult: true, 
		displayName: 'Pause all',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.PAUSE,
	} },
	{ 'resume': { 
		asyncResult: true, 
		displayName: 'Resume all',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.PLAY,
	} },
	{ 'rescan': { 
		asyncResult: true, 
		displayName: 'Rescan for errors',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.REFRESH,
		filter: finishedFailed,
	} },
	{ 'forceShare': { 
		asyncResult: true, 
		displayName: 'Force in share',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.ERROR,
		filter: finishedFailed,
	} },
	{ 'removeFile': { 
		asyncResult: true,
	} },
	{ 'removeSource': { 
		asyncResult: true,
	} },
]);

const setBundlePriorities = (prio, action) => {
	return SocketService.post(QueueConstants.BUNDLES_URL + '/priority', { priority: prio })
		.then(() => 
			action.completed())
		.catch((error) => 
			action.failed(error)
		);
};

const shareBundle = (bundle, skipScan, action) => {
	return SocketService.post(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/share', { 
		skip_scan: skipScan, 
	})
		.then(() => 
			action.completed(bundle))
		.catch((error) => 
			action.failed(error, bundle)
		);
};


QueueActions.setBundlePriority.listen(function (bundleId, newPrio) {
	let that = this;
	return SocketService.patch(QueueConstants.BUNDLE_URL + '/' + bundleId, {
		priority: newPrio
	})
		.then(that.completed)
		.catch(that.failed);
});

QueueActions.pause.listen(function () {
	setBundlePriorities(PriorityEnum.PAUSED_FORCED, QueueActions.pause);
});

QueueActions.resume.listen(function () {
	setBundlePriorities(PriorityEnum.DEFAULT, QueueActions.pause);
});

QueueActions.rescan.listen(function (bundle) {
	shareBundle(bundle, false, QueueActions.rescan);
});

QueueActions.forceShare.listen(function (bundle) {
	shareBundle(bundle, true, QueueActions.forceShare);
});

QueueActions.removeFinished.listen(function () {
	let that = this;
	return SocketService.post(QueueConstants.BUNDLES_URL + '/remove_finished')
		.then(that.completed)
		.catch(that.failed);
});

QueueActions.removeFinished.completed.listen(function (data) {
	NotificationActions.error({ 
		title: 'Action completed',
		message: data.count > 0 ? data.count + ' bundles were removed' : 'No bundles were removed',
	});
});

QueueActions.removeBundle.shouldEmit = function (bundle) {
	if (bundle.status.finished) {
		// No need to confirm finished bundles
		this.confirmed(bundle, false);
	} else {
		const options = {
			title: this.displayName,
			content: 'Are you sure that you want to remove the bundle ' + bundle.name + '?',
			icon: this.icon,
			approveCaption: 'Remove bundle',
			rejectCaption: "Don't remove",
			checkboxCaption: 'Remove finished files',
		};

		ConfirmDialog(options, this.confirmed.bind(this, bundle));
	}
	return false;
};

QueueActions.removeBundle.confirmed.listen(function (bundle, removeFinished) {
	let that = this;
	return SocketService.post(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/remove', { remove_finished: removeFinished })
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.searchBundle.listen(function (bundle) {
	let that = this;
	return SocketService.post(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/search')
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.removeFile.listen(function (item) {
	const that = this;
	const { target } = item;
	return SocketService.post(QueueConstants.REMOVE_FILE_URL, {
		target
	})
		.then(that.completed.bind(that, target))
		.catch(that.failed);
});

QueueActions.removeFile.completed.listen(function (target, data) {
	NotificationActions.error({ 
		title: 'Queued file removed',
		message: 'The file ' + target + ' was removed from queue',
	});
});

QueueActions.removeFile.failed.listen(function (target, error) {
	NotificationActions.error({ 
		title: 'Failed to remove ' + target,
		message: error.message,
	});
});

QueueActions.removeSource.listen(function (item) {
	let that = this;
	const { user } = item;
	return SocketService.post(QueueConstants.REMOVE_SOURCE_URL, {
		user,
	})
		.then(that.completed.bind(that, user))
		.catch(this.failed);
});

QueueActions.removeSource.completed.listen(function (user, data) {
	NotificationActions.error({ 
		title: 'Source removed',
		message: 'The user ' + user.nicks + ' was removed from ' + data.count + ' files',
	});
});

export default QueueActions;
