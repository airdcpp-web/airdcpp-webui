'use strict';
//@ts-ignore
import Reflux from 'reflux';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';
import SocketService from 'services/SocketService';
import { sleep } from 'utils/Promise';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';
import SearchConstants from 'constants/SearchConstants';

import ViewFileActions from 'actions/ViewFileActions';
import ViewFileStore from 'stores/ViewFileStore';

import { HintedUser } from 'types/api';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';
import { toErrorResponse } from 'utils/TypeConvert';


export type DownloadHandler<ItemT extends DownloadableItemInfo> = (
  itemInfo: ItemT, 
  user: API.HintedUserBase | undefined, 
  downloadData: API.DownloadData
) => void;

export interface DownloadableItemInfo {
  id: API.IdType;
  name: string;
  tth: string;
  size: number;
  type: API.FileItemType;
  path: string;
  dupe: API.Dupe;
}

export interface DownloadableItemData<ItemT extends DownloadableItemInfo = DownloadableItemInfo> {
  itemInfo: ItemT;
  user: HintedUser;
  handler: DownloadHandler<ItemT>;
}

const isAsch = ({ user }: DownloadableItemData) => user.flags.indexOf('asch') !== -1;
const isSearchable = ({ itemInfo }: DownloadableItemData) => itemInfo.name || itemInfo.tth;
const notSelf = ({ user }: DownloadableItemData) => user.flags.indexOf('self') === -1;
const isDirectory = ({ itemInfo }: DownloadableItemData) => itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }: DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'picture';
const isVideo = ({ itemInfo }: DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'video';
const isAudio = ({ itemInfo }: DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'audio';

// 200 MB, the web server isn't suitable for sending large files
const sizeValid = ({ itemInfo }: DownloadableItemData) => itemInfo.size < 200 * 1024 * 1024;

const viewText = (data: DownloadableItemData) => !isDirectory(data) && !isPicture(data) && 
  !isVideo(data) && !isAudio(data) && data.itemInfo.size < 256 * 1024;
const findNfo = (data: DownloadableItemData) => isDirectory(data) && notSelf(data) && isAsch(data);

const viewVideo = (data: DownloadableItemData) => isVideo(data) && sizeValid(data);
const viewAudio = (data: DownloadableItemData) => isAudio(data) && sizeValid(data);
const viewImage = (data: DownloadableItemData) => isPicture(data) && sizeValid(data);

const copyMagnet = (data: DownloadableItemData) => !!(navigator as any).clipboard && !isDirectory(data);


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
] as UI.ActionConfigList<DownloadableItemData>);

DownloadableItemActions.download.listen(function (handlerData: DownloadableItemData) {
  const { handler, itemInfo, user } = handlerData;
  return handler(
    itemInfo, 
    user, 
    { 
      target_name: handlerData.itemInfo.name 
    }
  );
});

DownloadableItemActions.downloadTo.listen(function (handlerData: DownloadableItemData, location: Location) {
  const { pathname } = location;
  History.push(`${pathname}/download/${handlerData.itemInfo.id}`);
});

DownloadableItemActions.viewText.listen(function (data: DownloadableItemData, location: Location) {
  ViewFileActions.createSession(data, true, location, ViewFileStore);
});

DownloadableItemActions.viewVideo.listen(function (data: DownloadableItemData, location: Location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.viewAudio.listen(function (data: DownloadableItemData, location: Location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.viewImage.listen(function (data: DownloadableItemData, location: Location) {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
});

DownloadableItemActions.findNfo.listen(async function (
  this: UI.AsyncActionType<DownloadableItemData>, 
  data: DownloadableItemData, 
  location: Location
) {
  try {
    // Get a new instance
    let instance = await SocketService.post<API.SearchInstance>(SearchConstants.INSTANCES_URL, {
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

      instance = await SocketService.get<API.SearchInstance>(`${SearchConstants.INSTANCES_URL}/${instance.id}`);
      if (instance.result_count > 0) {
        break;
      }
    }

    if (instance.result_count > 0) {
      // Open the first result for viewing
      const results = await SocketService.get(`${SearchConstants.INSTANCES_URL}/${instance.id}/results/0/1`);

      DownloadableItemActions.viewText(
        {
          itemInfo: results[0],
          user: data.user,
        }, 
        location
      );

      this.completed(data, location);
    } else {
      this.failed(toErrorResponse(404, 'No NFO results were received'), data);
    }
  } catch (error) {
    this.failed(error.message, data);
  }
});

DownloadableItemActions.findNfo.failed.listen(function (errorMessage: ErrorResponse, data: DownloadableItemData) {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: errorMessage,
  });
});

DownloadableItemActions.search.listen(function (handlerData: DownloadableItemData, location: Location) {
  const { itemInfo } = handlerData;
  const searchString = !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

  History.pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      }
    }, 
    location
  );
});

DownloadableItemActions.copyMagnet.listen(function (
  this: UI.AsyncActionType<DownloadableItemData>, 
  data: DownloadableItemData
) {
  const { size, tth, name } = data.itemInfo;
  const sizeParam = size > 0 ? `&xl=${size}` : '';
  const link = `magnet:?xt=urn:tree:tiger:${tth}${sizeParam}&dn=${encodeURI(name)}`;

  let that = this;
  (navigator as any).clipboard.writeText(link)
    .then(that.completed.bind(that, data))
    .catch(that.failed.bind(that));
});

DownloadableItemActions.copyMagnet.completed.listen(function (data: DownloadableItemData) {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: 'Magnet link was copied on clipboard',
  });
});

DownloadableItemActions.copyMagnet.failed.listen(function (errorMessage: string) {
  NotificationActions.error({ 
    title: 'Failed to copy magnet link to clipboard',
    message: errorMessage,
  });
});

export default DownloadableItemActions;
