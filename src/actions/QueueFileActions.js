'use strict';
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import DownloadableItemActions from 'actions/DownloadableItemActions';
import NotificationActions from 'actions/NotificationActions';


const itemNotFinished = item => item.time_finished === 0;


const QueueFileActions = Reflux.createActions([
	{ 'search': { 
		asyncResult: true,
		access: AccessConstants.SEARCH, 
		displayName: 'Search (foreground)', 
		icon: IconConstants.SEARCH,
	} },
	{ 'searchFileAlternates': { 
		asyncResult: true,
		access: AccessConstants.QUEUE_EDIT, 
		displayName: 'Search for alternates', 
		icon: IconConstants.SEARCH_ALTERNATES,
		filter: itemNotFinished,
	} },
	{ 'setFilePriority': { 
		asyncResult: true,
	} },
	{ 'removeFile': { 
		asyncResult: true, 
		children: [ 'confirmed' ], 
		displayName: 'Remove',
		access: AccessConstants.QUEUE_EDIT,
		icon: IconConstants.REMOVE,
	} },
]);

QueueFileActions.search.listen(function (itemInfo, location) {
	return DownloadableItemActions.search({ 
		itemInfo,
	}, location);
});

QueueFileActions.removeFile.shouldEmit = function (file) {
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

QueueFileActions.removeFile.confirmed.listen(function (item, removeFinished) {
	const that = this;
	const { target, id } = item;
	return SocketService.post(QueueConstants.FILES_URL + '/' + id + '/remove', {
		remove_finished: removeFinished,
	})
		.then(QueueFileActions.removeFile.completed.bind(that, target))
		.catch(QueueFileActions.removeFile.failed.bind(that, target));
});

QueueFileActions.removeFile.completed.listen(function (target, data) {
	NotificationActions.success({ 
		title: 'Queued file removed',
		message: 'The file ' + target + ' was removed from queue',
	});
});

QueueFileActions.removeFile.failed.listen(function (target, error) {
	NotificationActions.apiError('Failed to remove ' + target, error);
});

QueueFileActions.searchFileAlternates.listen(function (file) {
	let that = this;
	return SocketService.post(QueueConstants.FILES_URL + '/' + file.id + '/search')
		.then(that.completed.bind(that, file))
		.catch(this.failed.bind(that, file));
});

QueueFileActions.searchFileAlternates.completed.listen(function (file, data) {
	NotificationActions.success({ 
		title: file.name,
		message: 'File was searched for alternates',
	});
});

QueueFileActions.searchFileAlternates.failed.listen(function (file, error) {
	NotificationActions.error({ 
		title: file.name,
		message: 'Failed to search the file for alternates: ' + error.message,
	});
});

QueueFileActions.setFilePriority.listen(function (file, priority) {
	let that = this;
	return SocketService.post(QueueConstants.FILES_URL + '/' + file.id + '/priority', {
		priority
	})
		.then(that.completed.bind(that, file))
		.catch(that.failed.bind(that, file));
});

export default QueueFileActions;
