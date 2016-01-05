'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';
import ViewFileActions from 'actions/ViewFileActions';
import FilelistActions from 'actions/FilelistActions';


export const DownloadActions = Reflux.createActions([
	{ 'download': { 
		asyncResult: true,	
		displayName: 'Download', 
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD 
	} },
	{ 'downloadTo': { 
		asyncResult: true,	
		displayName: 'Download to...',
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD_TO, 
	} }, 
	{ 'viewText': {
		asyncResult: true,	
		displayName: 'View as text',
		access: AccessConstants.VIEW_FILE_EDIT, 
		icon: IconConstants.OPEN, 
	} },
	{ 'viewImage': {
		asyncResult: true,	
		displayName: 'View image',
		access: AccessConstants.VIEW_FILE_EDIT, 
		icon: IconConstants.OPEN, 
	} },
	{ 'findNfo': {
		asyncResult: true,	
		displayName: 'Find NFO',
		access: AccessConstants.VIEW_FILE_EDIT, // TODO: FIX
		icon: IconConstants.FIND, 
	} }
]);

DownloadActions.download.listen(function (data) {
	return data.handler(data, { target_name: data.itemInfo.name });
});

DownloadActions.viewText.listen(function (data) {
	ViewFileActions.createSession(data, true);
});

DownloadActions.viewImage.listen(function (data) {
	ViewFileActions.createSession(data, false);
});

DownloadActions.findNfo.listen(function (data) {
	FilelistActions.findNfo(data);
});

DownloadActions.downloadTo.listen(function (handlerData) {
	const { pathname } = handlerData.location;
	
	History.pushModal(handlerData.location, pathname + '/download', OverlayConstants.DOWNLOAD_MODAL_ID, {
		downloadHandler: downloadData => handlerData.handler(handlerData, downloadData),
		itemInfo:handlerData.itemInfo
	});
});

export default DownloadActions;
