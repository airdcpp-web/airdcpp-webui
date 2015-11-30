'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import { SHARE_REFRESH_URL, SHARE_REFRESH_PATHS_URL } from 'constants/ShareConstants';
import { ICON_REFRESH } from 'constants/IconConstants';

const ShareActions = Reflux.createActions([
	{ 'refresh': { 
		asyncResult: true,
		displayName: 'Refresh all',
		icon: ICON_REFRESH }
	},
	{ 'refreshPaths': { 
		asyncResult: true,
		displayName: 'Refresh directory',
		icon: ICON_REFRESH }
	},
]);

ShareActions.refresh.listen(function (incoming) {
	const that = this;
	return SocketService.post(SHARE_REFRESH_URL)
		.then(that.completed)
		.catch(that.failed);
});

ShareActions.refreshPaths.listen(function (paths) {
	const that = this;
	return SocketService.post(SHARE_REFRESH_PATHS_URL, { paths: paths })
		.then(that.completed)
		.catch(that.failed);
});

export default ShareActions;
