'use strict';
import Reflux from 'reflux';
import { default as QueueConstants } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import { PriorityEnum } from 'constants/QueueConstants';
import OverlayConstants from 'constants/OverlayConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';


const finishedFailed = bundle => bundle.status.failed && bundle.status.finished;
const itemNotFinished = file => file.time_finished === 0;
const isDirectoryBundle = bundle => bundle.type.id === 'directory';
const hasSources = bundle => bundle.sources.total > 0 && itemNotFinished(bundle);


export const QueueActions = Reflux.createActions([
	{ 'searchBundle': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Search for alternates', 
		icon: IconConstants.SEARCH,
	} },
	{ 'setBundlePriority': { 
		asyncResult: true,
	} },
	{ 'setBundleAutoPriority': { 
		asyncResult: true,
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
	{ 'removeBundleSource': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Remove source', 
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
	{ 'searchFile': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Search for alternates', 
		icon: IconConstants.SEARCH,
	} },
	{ 'setFilePriority': { 
		asyncResult: true,
	} },
	{ 'setFileAutoPriority': { 
		asyncResult: true,
	} },
	{ 'removeFile': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.REMOVE,
		//filter: fileNotFinished,
	} },
	{ 'removeSource': { 
		asyncResult: true,
	} },
	{ 'sources': { 
		asyncResult: false,
		displayName: 'Manage sources...', 
		icon: IconConstants.USER,
		filter: hasSources,
	} },
	{ 'content': { 
		asyncResult: false,
		displayName: 'Manage files...', 
		icon: IconConstants.FILE,
		filter: isDirectoryBundle,
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


QueueActions.setBundlePriority.listen(function (bundle, newPrio) {
	let that = this;
	return SocketService.patch(QueueConstants.BUNDLE_URL + '/' + bundle.id, {
		priority: newPrio
	})
		.then(that.completed)
		.catch(that.failed);
});

QueueActions.setBundleAutoPriority.listen(function (bundle, autoPrio) {
	let that = this;
	return SocketService.patch(QueueConstants.BUNDLE_URL + '/' + bundle.id, {
		auto_priority: autoPrio
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

QueueActions.removeBundleSource.listen(function ({ source, bundle }) {
	let that = this;
	return SocketService.delete(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/source/' + source.user.cid)
		.then(that.completed)
		.catch(that.failed);
});

QueueActions.removeFinished.completed.listen(function (data) {
	NotificationActions.success({ 
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
	return SocketService.post(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/remove', { 
		remove_finished: removeFinished,
	})
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.searchBundle.listen(function (bundle) {
	let that = this;
	return SocketService.post(QueueConstants.BUNDLE_URL + '/' + bundle.id + '/search')
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.removeFile.shouldEmit = function (file) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the file ' + file.name + '?',
		icon: this.icon,
		approveCaption: 'Remove file',
		rejectCaption: "Don't remove",
		checkboxCaption: 'Remove on disk',
	};

	ConfirmDialog(options, this.confirmed.bind(this, file));
	return false;
};

QueueActions.removeFile.confirmed.listen(function (item, removeFinished) {
	const that = this;
	const { target } = item;
	return SocketService.post(QueueConstants.REMOVE_FILE_URL, {
		target,
		remove_finished: removeFinished,
	})
		.then(QueueActions.removeFile.completed.bind(that, target))
		.catch(QueueActions.removeFile.failed);
});

QueueActions.removeFile.completed.listen(function (target, data) {
	NotificationActions.success({ 
		title: 'Queued file removed',
		message: 'The file ' + target + ' was removed from queue',
	});
});

QueueActions.removeFile.failed.listen(function (target, error) {
	NotificationActions.apiError('Failed to remove ' + target, error);
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
	NotificationActions.info({ 
		title: 'Source removed',
		message: 'The user ' + user.nicks + ' was removed from ' + data.count + ' files',
	});
});

QueueActions.sources.listen(function (data, location) {
	History.pushModal(location, location.pathname + '/sources', OverlayConstants.BUNDLE_SOURCE_MODAL, { bundle: data });
});

QueueActions.content.listen(function (data, location) {
	History.pushModal(location, location.pathname + '/content', OverlayConstants.BUNDLE_CONTENT_MODAL, { bundle: data });
});

QueueActions.searchFile.listen(function (file) {
	let that = this;
	return SocketService.post(QueueConstants.FILE_URL + '/' + file.id + '/search')
		.then(that.completed)
		.catch(this.failed);
});

QueueActions.setFilePriority.listen(function (file, newPrio) {
	let that = this;
	return SocketService.patch(QueueConstants.FILE_URL + '/' + file.id, {
		priority: newPrio
	})
		.then(that.completed)
		.catch(that.failed);
});

QueueActions.setFileAutoPriority.listen(function (file, autoPrio) {
	let that = this;
	return SocketService.patch(QueueConstants.FILE_URL + '/' + file.id, {
		auto_priority: autoPrio
	})
		.then(that.completed)
		.catch(that.failed);
});

export default QueueActions;
