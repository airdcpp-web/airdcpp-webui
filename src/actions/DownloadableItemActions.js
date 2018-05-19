'use strict';
import Reflux from 'reflux';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';
import OverlayConstants from 'constants/OverlayConstants';
import SocketService from 'services/SocketService';
import { sleep } from 'utils/Promise';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';
import SearchConstants from 'constants/SearchConstants';

import ViewFileActions from 'actions/ViewFileActions';
import ViewFileStore from 'stores/ViewFileStore';


const isAsch = ({ user }) => user.flags.indexOf('asch') !== -1;
const isSearchable = ({ itemInfo }) => itemInfo.name || itemInfo.tth;
const notSelf = ({ user }) => user.flags.indexOf('self') === -1;
const isDirectory = ({ itemInfo }) => itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }) => itemInfo.type.content_type === 'picture';
const isVideo = ({ itemInfo }) => itemInfo.type.content_type === 'video';
const isAudio = ({ itemInfo }) => itemInfo.type.content_type === 'audio';
const sizeValid = ({ itemInfo }) => itemInfo.size < 200*1024*1024; // 200 MB, the web server isn't suitable for sending large files

const viewText = data => !isDirectory(data) && !isPicture(data) && !isVideo(data) && !isAudio(data) && data.itemInfo.size < 256*1024;
const findNfo = data => isDirectory(data) && notSelf(data) && isAsch(data);

const viewVideo = data => isVideo(data) && sizeValid(data);
const viewAudio = data => isAudio(data) && sizeValid(data);
const viewImage = data => isPicture(data) && sizeValid(data);

const copyMagnet = data => !!navigator.clipboard && !isDirectory(data);


export const DownloadableItemActions = Reflux.createActions([
  { 'download': { 
    asyncResult: true,	
    displayName: 'Download', 
    access: AccessConstants.DOWNLOAD, 
    icon: IconConstants.DOWNLOAD,
    filter: notSelf,
  } },
  { 'downloadTo': { 
    asyncResult: true,	
    displayName: 'Download to...',
    access: AccessConstants.DOWNLOAD, 
    icon: IconConstants.DOWNLOAD_TO,
    filter: notSelf,
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
    filter: isSearchable, // Example: root directory in filelists can't be searched for
  } },
  { 'copyMagnet': {
    asyncResult: true,
    displayName: 'Copy magnet link',
    icon: IconConstants.MAGNET,
    filter: copyMagnet,
  } }
]);

DownloadableItemActions.download.listen(function (handlerData) {
  const { handler, itemInfo, user } = handlerData;
  return handler(itemInfo, user, { 
    target_name: handlerData.itemInfo.name 
  });
});

DownloadableItemActions.downloadTo.listen(function (handlerData, location) {
  const { pathname } = location;
	
  History.pushModal(location, pathname + '/download', OverlayConstants.DOWNLOAD_MODAL_ID, {
    itemInfo: handlerData.itemInfo,
    user: handlerData.user,
  });
});

DownloadableItemActions.viewText.listen(function (data, location) {
  ViewFileActions.createSession(data, true, location, ViewFileStore);
});

DownloadableItemActions.viewVideo.listen(function (data, location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.viewAudio.listen(function (data, location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.viewImage.listen(function (data, location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.findNfo.listen(/*async*/ function (data, location) {
  /*try {
    // Get a new instance
    let instance = await SocketService.post(SearchConstants.INSTANCES_URL, {
      expiration_minutes: 1,
    });

    // Post the search
    await SocketService.post(`${SearchConstants.INSTANCES_URL}/${instance.id}/user_search`, {
      user: data.user,
      query: {
        extensions: [ 'nfo' ],
        max_size: 256 * 1024,
      },
      options: {
        path: data.itemInfo.path,
        max_results: 1,
      }
    });

    // Wait for the results to arrive
    for (let i = 0; i < 5; i++) {
      await sleep(500);

      instance = await SocketService.get(`${SearchConstants.INSTANCES_URL}/${instance.id}`);
      if (instance.result_count > 0) {
        break;
      }
    }

    if (instance.result_count > 0) {
      // Open the first result for viewing
      const results = await SocketService.get(`${SearchConstants.INSTANCES_URL}/${instance.id}/results/0/1`);

      DownloadableItemActions.viewText({
        itemInfo: results[0],
        user: data.user,
      }, location);

      this.completed(data, location);
    } else {
      this.failed(data, 'No NFO results were received');
    }
  } catch (error) {
    this.failed(data, error.message);
  }*/
});

DownloadableItemActions.findNfo.failed.listen(function (data, errorMessage) {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: errorMessage,
  });
});

DownloadableItemActions.search.listen(function (handlerData, location) {
  const { itemInfo } = handlerData;
  const searchString = !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

  History.pushUnique({
    pathname: '/search',
    state: {
      searchString,
    }
  }, location);
});

DownloadableItemActions.copyMagnet.listen(function (data) {
  const { size, tth, name } = data.itemInfo;
  const sizeParam = size > 0 ? `&xl=${size}` : '';
  const link = `magnet:?xt=urn:tree:tiger:${tth}${sizeParam}&dn=${encodeURI(name)}`;

  let that = this;
  navigator.clipboard.writeText(link)
    .then(that.completed.bind(that, data))
    .catch(that.failed.bind(that, data));
});

DownloadableItemActions.copyMagnet.completed.listen(function (data, errorMessage) {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: 'Magnet link was copied on clipboard',
  });
});

DownloadableItemActions.copyMagnet.failed.listen(function (data, errorMessage) {
  NotificationActions.error({ 
    title: 'Failed to copy magnet link to clipboard',
    message: errorMessage,
  });
});

export default DownloadableItemActions;
