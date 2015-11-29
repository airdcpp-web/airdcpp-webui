'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import { SHARE_REFRESH_URL, SHARE_REFRESH_PATHS_URL } from 'constants/ShareConstants';


const ShareActions = Reflux.createActions([
	{ 'refresh': { 
		asyncResult: true, }
	},
	{ 'refreshPaths': { 
		asyncResult: true, }
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
