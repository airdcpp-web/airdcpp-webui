'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';
import ViewFileActions from 'actions/ViewFileActions';
import FilelistActions from 'actions/FilelistActions';


const notMe = ({ user }) => user.flags.indexOf('me') === -1;
const isDirectory = ({ itemInfo }) => itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }) => itemInfo.type.content_type === 'picture';
const isVideo = ({ itemInfo }) => itemInfo.type.content_type === 'video';
const isAudio = ({ itemInfo }) => itemInfo.type.content_type === 'audio';

const viewText = data => !isDirectory(data) && !isPicture(data) && !isVideo(data) && !isAudio(data) && data.itemInfo.size < 256*1024;
const findNfo = data => isDirectory(data) && notMe(data);

export const DownloadActions = Reflux.createActions([
	{ 'download': { 
		asyncResult: true,	
		displayName: 'Download', 
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD,
		filter: notMe,
	} },
	{ 'downloadTo': { 
		asyncResult: true,	
		displayName: 'Download to...',
		access: AccessConstants.DOWNLOAD, 
		icon: IconConstants.DOWNLOAD_TO,
		filter: notMe,
	} }, 
	{ 'viewText': {
		asyncResult: true,	
		displayName: 'View as text',
		access: AccessConstants.VIEW_FILE_EDIT, 
		icon: IconConstants.OPEN, 
		filter: viewText,
	} },
	{ 'viewImage': {
		asyncResult: true,	
		displayName: 'View image',
		access: AccessConstants.VIEW_FILE_EDIT, 
		icon: IconConstants.OPEN, 
		filter: isPicture,
	} },
	{ 'findNfo': {
		asyncResult: true,	
		displayName: 'Find NFO',
		access: AccessConstants.VIEW_FILE_EDIT,
		icon: IconConstants.FIND,
		filter: findNfo,
	} },
	{ 'viewVideo': {
		asyncResult: true,	
		displayName: 'Play video',
		access: AccessConstants.VIEW_FILE_EDIT,
		icon: IconConstants.OPEN,
		filter: isVideo,
	} },
	{ 'viewAudio': {
		asyncResult: true,	
		displayName: 'Play audio',
		access: AccessConstants.VIEW_FILE_EDIT,
		icon: IconConstants.OPEN,
		filter: isAudio,
	} }
]);

DownloadActions.download.listen(function (data) {
	return data.handler(data, { target_name: data.itemInfo.name });
});

DownloadActions.viewText.listen(function (data) {
	ViewFileActions.createSession(data, true);
});

DownloadActions.viewVideo.listen(function (data) {
	ViewFileActions.createSession(data, false);
});

DownloadActions.viewAudio.listen(function (data) {
	ViewFileActions.createSession(data, false);
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
