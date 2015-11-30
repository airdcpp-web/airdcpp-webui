'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import { DOWNLOAD_MODAL_ID } from 'constants/OverlayConstants';

import { ICON_DOWNLOAD, ICON_DOWNLOAD_TO } from 'constants/IconConstants';

export const DownloadActions = Reflux.createActions([
	{ 'download': { 
		asyncResult: true,	
		displayName: 'Download', 
		icon: ICON_DOWNLOAD } 
	},
	{ 'downloadTo': { 
		asyncResult: true,	
		displayName: 'Download to...', 
		icon: ICON_DOWNLOAD_TO } 
	}
]);

DownloadActions.download.listen(function (data) {
	return data.handler(data, { target_name: data.itemInfo.name });
});

DownloadActions.downloadTo.listen(function (handlerData) {
	const { pathname } = handlerData.location;
	
	History.pushModal(handlerData.location, pathname + '/download', DOWNLOAD_MODAL_ID, {
		downloadHandler: downloadData => handlerData.handler(handlerData, downloadData),
		itemInfo:handlerData.itemInfo
	});
});

export default DownloadActions;
