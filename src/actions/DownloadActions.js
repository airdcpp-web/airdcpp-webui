'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


export const DownloadActions = Reflux.createActions([
	{ 'download': { 
		asyncResult: true,	
		displayName: 'Download', 
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD } 
	},
	{ 'downloadTo': { 
		asyncResult: true,	
		displayName: 'Download to...',
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD_TO } 
	}
]);

DownloadActions.download.listen(function (data) {
	return data.handler(data, { target_name: data.itemInfo.name });
});

DownloadActions.downloadTo.listen(function (handlerData) {
	const { pathname } = handlerData.location;
	
	History.pushModal(handlerData.location, pathname + '/download', OverlayConstants.DOWNLOAD_MODAL_ID, {
		downloadHandler: downloadData => handlerData.handler(handlerData, downloadData),
		itemInfo:handlerData.itemInfo
	});
});

export default DownloadActions;
