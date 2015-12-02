'use strict';
import Reflux from 'reflux';
import { BUNDLES_URL, BUNDLE_URL, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import { ICON_REMOVE, ICON_SEARCH, ICON_PAUSE, ICON_PLAY } from 'constants/IconConstants';
import { PriorityEnum } from 'constants/QueueConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

export const QueueActions = Reflux.createActions([
	{ 'searchBundle': { 
		asyncResult: true, 
		displayName: 'Search for alternates', 
		icon: ICON_SEARCH } 
	},
	{ 'setBundlePriority': { 
		asyncResult: true, 
		displayName: 'Set priority' } 
	},
	{ 'removeBundle': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove', 
		icon: ICON_REMOVE } 
	},
	{ 'removeFinished': { 
		asyncResult: true, 
		displayName: 'Remove finished bundles', 
		icon: ICON_REMOVE } 
	},
	{ 'pause': { 
		asyncResult: true, 
		displayName: 'Pause all', 
		icon: ICON_PAUSE } 
	},
	{ 'resume': { 
		asyncResult: true, 
		displayName: 'Resume all', 
		icon: ICON_PLAY } 
	},
]);

const setBundlePriorities = (prio, action) => {
	return SocketService.post(BUNDLES_URL + '/priority', { priority: prio })
		.then(() => 
			action.completed())
		.catch((error) => 
			action.failed(error)
		);
};

QueueActions.setBundlePriority.listen(function (bundleId, newPrio) {
	let that = this;
	return SocketService.patch(BUNDLE_URL + '/' + bundleId, {
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

QueueActions.removeFinished.listen(function () {
	let that = this;
	return SocketService.post(BUNDLES_URL + '/remove_finished')
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
	if (bundle.status.id >= StatusEnum.STATUS_FINISHED) {
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
	console.log('Remove succeed');
	return SocketService.delete(BUNDLE_URL + '/' + bundle.id, { remove_finished: removeFinished })
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.searchBundle.listen(function (bundle) {
	let that = this;
	return SocketService.post(BUNDLE_URL + '/' + bundle.id + '/search')
		.then(that.completed)
		.catch(this.failed);
});

export default QueueActions;
