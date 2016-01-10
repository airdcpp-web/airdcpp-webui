'use strict';
import Reflux from 'reflux';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';
import { PriorityEnum } from 'constants/QueueConstants';
import AccessConstants from 'constants/AccessConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';


const bundleFailed = bundle => bundle.status.failed;

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
		filter: bundleFailed,
	} },
	{ 'forceShare': { 
		asyncResult: true, 
		displayName: 'Force in share',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.ERROR,
		filter: bundleFailed,
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
		.catch(this.failed);
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
		.catch(this.failed);
});

QueueActions.removeFinished.completed.listen(function (data) {
	NotificationActions.error({ 
		title: 'Action completed',
		message: data.count > 0 ? data.count + ' bundles were removed' : 'No bundles were removed',
	});
});

QueueActions.removeBundle.shouldEmit = function (bundle) {
	if (bundle.status.id >= StatusEnum.FINISHED) {
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

		ConfirmDialog(options).then((removeFinished) => this.confirmed(bundle, removeFinished));
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

export default QueueActions;
