'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


import ConfirmDialog from 'components/semantic/ConfirmDialog';
import FileSystemConstants from 'constants/FileSystemConstants';
import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';


const ShareActions = Reflux.createActions([
	{ 'refresh': { 
		asyncResult: true,
		displayName: 'Refresh all',
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.REFRESH,
	} },
	{ 'refreshPaths': { 
		asyncResult: true,
		displayName: 'Refresh directory',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.REFRESH,
	} }, 
	{ 'refreshVirtual': { 
		asyncResult: true,
	} },
	{ 'addExclude': { 
		asyncResult: true,
		children: [ 'saved' ], 
		displayName: 'Add path',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.CREATE,
	} }, 
	{ 'removeExclude': { 
		asyncResult: true,
		children: [ 'confirmed' ], 
		displayName: 'Remove path',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.REMOVE,
	} }, 
]);

ShareActions.refresh.listen(function (incoming) {
	const that = this;
	return SocketService.post(ShareConstants.REFRESH_URL)
		.then(that.completed)
		.catch(that.failed);
});

ShareActions.refreshPaths.listen(function (paths) {
	const that = this;
	return SocketService.post(ShareConstants.REFRESH_PATHS_URL, { paths: paths })
		.then(that.completed)
		.catch(that.failed);
});

ShareActions.refreshVirtual.listen(function (path, profile) {
	const that = this;
	return SocketService.post(ShareConstants.REFRESH_VIRTUAL_URL, { 
		path,
		profile, 
	})
		.then(that.completed)
		.catch(that.failed);
});

ShareActions.refreshVirtual.failed.listen(function (error) {
	NotificationActions.error({ 
		title: 'Refresh failed',
		message: error.message,
	});
});

ShareActions.addExclude.listen(function (location) {
	History.pushModal(location, location.pathname + '/browse', OverlayConstants.FILE_BROWSER_MODAL, {
		onConfirm: this.saved.bind(this),
		subHeader: 'Add excluded path',
		historyId: FileSystemConstants.LOCATION_DOWNLOAD,
	});
});

ShareActions.addExclude.saved.listen(function (path) {
	return SocketService.post(ShareConstants.EXCLUDE_ADD_URL, { path })
		.then(ShareActions.addExclude.completed)
		.catch(ShareActions.addExclude.failed);
});

ShareActions.addExclude.failed.listen(function (error) {
	NotificationActions.apiError('Failed to add directory', error);
});

ShareActions.removeExclude.listen(function (path) {
	const options = {
		title: this.displayName,
		content: 'Are you sure that you want to remove the excluded path ' + path + '?',
		icon: this.icon,
		approveCaption: 'Remove path',
		rejectCaption: "Don't remove",
	};

	ConfirmDialog(options, this.confirmed.bind(this, path));
});

ShareActions.removeExclude.confirmed.listen(function (path) {
	const that = this;
	return SocketService.post(ShareConstants.EXCLUDE_REMOVE_URL, { path })
		.then(ShareActions.removeExclude.completed.bind(that, path))
		.catch(ShareActions.removeExclude.failed.bind(that, path));
});

export default ShareActions;
