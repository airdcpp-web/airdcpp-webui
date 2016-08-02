'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import FilelistActions from 'actions/FilelistActions';
import SearchActions from 'actions/SearchActions';
import ViewFileActions from 'actions/ViewFileActions';


const notMe = ({ user }) => user.flags.indexOf('me') === -1;
const isDirectory = ({ itemInfo }) => itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }) => itemInfo.type.content_type === 'picture';
const isVideo = ({ itemInfo }) => itemInfo.type.content_type === 'video';
const isAudio = ({ itemInfo }) => itemInfo.type.content_type === 'audio';
const sizeValid = ({ itemInfo }) => itemInfo.size < 200*1024*1024; // 200 MB, the web server isn't suitable for sending large files

const viewText = data => !isDirectory(data) && !isPicture(data) && !isVideo(data) && !isAudio(data) && data.itemInfo.size < 256*1024;
const findNfo = data => isDirectory(data) && notMe(data);

const viewVideo = data => isVideo(data) && sizeValid(data);
const viewAudio = data => isAudio(data) && sizeValid(data);
const viewImage = data => isPicture(data) && sizeValid(data);


export const DownloadableItemActions = Reflux.createActions([
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
	'divider',
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
		filter: viewImage,
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
		filter: viewVideo,
	} },
	{ 'viewAudio': {
		asyncResult: true,	
		displayName: 'Play audio',
		access: AccessConstants.VIEW_FILE_EDIT,
		icon: IconConstants.OPEN,
		filter: viewAudio,
	} },
	{ 'search': {
		asyncResult: true,	
		displayName: 'Search',
		access: AccessConstants.SEARCH,
		icon: IconConstants.SEARCH,
	} }
]);

DownloadableItemActions.download.listen(function (data) {
	return data.handler(data, { target_name: data.itemInfo.name });
});

DownloadableItemActions.viewText.listen(function (data) {
	ViewFileActions.createSession(data, true);
});

DownloadableItemActions.viewVideo.listen(function (data) {
	ViewFileActions.createSession(data, false);
});

DownloadableItemActions.viewAudio.listen(function (data) {
	ViewFileActions.createSession(data, false);
});

DownloadableItemActions.viewImage.listen(function (data) {
	ViewFileActions.createSession(data, false);
});

DownloadableItemActions.findNfo.listen(function (data) {
	FilelistActions.findNfo(data);
});

DownloadableItemActions.downloadTo.listen(function (handlerData) {
	const { pathname } = handlerData.location;
	
	History.pushModal(handlerData.location, pathname + '/download', OverlayConstants.DOWNLOAD_MODAL_ID, {
		downloadHandler: downloadData => handlerData.handler(handlerData, downloadData),
		itemInfo:handlerData.itemInfo
	});
});

DownloadableItemActions.search.listen(function (data) {
	const { itemInfo } = data;
	const searchString = itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

	History.push({
		pathname: '/search',
		state: {
			searchString,
		}
	});
});

export default DownloadableItemActions;
