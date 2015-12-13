'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const ShareActions = Reflux.createActions([
	{ 'refresh': { 
		asyncResult: true,
		displayName: 'Refresh all',
		access: AccessConstants.SETTINGS_EDIT,
		icon: IconConstants.REFRESH }
	},
	{ 'refreshPaths': { 
		asyncResult: true,
		displayName: 'Refresh directory',
		access: AccessConstants.SETTINGS_EDIT, 
		icon: IconConstants.REFRESH }
	},
]);

ShareActions.refresh.listen(function (incoming) {
	const that = this;
	return SocketService.post(ShareConstants.SHARE_REFRESH_URL)
		.then(that.completed)
		.catch(that.failed);
});

ShareActions.refreshPaths.listen(function (paths) {
	const that = this;
	return SocketService.post(ShareConstants.SHARE_REFRESH_PATHS_URL, { paths: paths })
		.then(that.completed)
		.catch(that.failed);
});

export default ShareActions;
