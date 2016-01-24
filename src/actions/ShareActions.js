'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


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
		//displayName: 'Refresh directory',
		//access: AccessConstants.SETTINGS_EDIT, 
		//icon: IconConstants.REFRESH,
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

export default ShareActions;
