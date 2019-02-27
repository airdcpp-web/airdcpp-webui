'use strict';

import History from 'utils/History';
import SocketService from 'services/SocketService';
import { sleep } from 'utils/Promise';

import IconConstants from 'constants/IconConstants';
import SearchConstants from 'constants/SearchConstants';

import ViewFileActions from 'actions/reflux/ViewFileActions';
import ViewFileStore from 'stores/ViewFileStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

//import { Location } from 'history';
//import { ErrorResponse } from 'airdcpp-apisocket';
import { toErrorResponse } from 'utils/TypeConvert';
import SearchActions from 'actions/reflux/SearchActions';


/*export type DownloadHandler<ItemT extends DownloadableItemInfo> = (
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

export interface UI.DownloadableItemData<ItemT extends DownloadableItemInfo = DownloadableItemInfo> {
  itemInfo: ItemT;
  user: HintedUser;
  handler: DownloadHandler<ItemT>;
}*/

const isAsch = ({ user }: UI.DownloadableItemData) => user.flags.indexOf('asch') !== -1;
const isSearchable = ({ itemInfo }: UI.DownloadableItemData) => !!itemInfo.name || !!itemInfo.tth;
const notSelf = ({ user }: UI.DownloadableItemData) => user.flags.indexOf('self') === -1;
const isDirectory = ({ itemInfo }: UI.DownloadableItemData) => itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }: UI.DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'picture';
const isVideo = ({ itemInfo }: UI.DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'video';
const isAudio = ({ itemInfo }: UI.DownloadableItemData) => (itemInfo.type as API.FileType).content_type === 'audio';

// 200 MB, the web server isn't suitable for sending large files
const sizeValid = ({ itemInfo }: UI.DownloadableItemData) => itemInfo.size < 200 * 1024 * 1024;

const viewText = (data: UI.DownloadableItemData) => !isDirectory(data) && !isPicture(data) && 
  !isVideo(data) && !isAudio(data) && data.itemInfo.size < 256 * 1024;
const findNfo = (data: UI.DownloadableItemData) => isDirectory(data) && notSelf(data) && isAsch(data);

const viewVideo = (data: UI.DownloadableItemData) => isVideo(data) && sizeValid(data);
const viewAudio = (data: UI.DownloadableItemData) => isAudio(data) && sizeValid(data);
const viewImage = (data: UI.DownloadableItemData) => isPicture(data) && sizeValid(data);

const copyMagnet = (data: UI.DownloadableItemData) => !!(navigator as any).clipboard && !isDirectory(data);



const handleDownload: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const { handler, itemInfo, user } = data;
  return handler(
    itemInfo, 
    user, 
    { 
      target_name: itemInfo.name 
    }
  );
};

const handleDownloadTo: UI.ActionHandler<UI.DownloadableItemData> = ({ data, location }) => {
  const { pathname } = location;
  History.push(`${pathname}/download/${data.itemInfo.id}`);
};

const handleViewText: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  ViewFileActions.createSession(data, true, location, ViewFileStore);
};

const handleViewVideo: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
};

const handleViewAudio: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
};

const handleViewImage: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  ViewFileActions.createSession(data, false, location, ViewFileStore);
};

const handleFindNfo: UI.ActionHandler<UI.DownloadableItemData> = async ({ data, location }) => {
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

      handleViewText({
        data: {
          itemInfo: results[0],
          user: data.user,
          handler: data.handler,
        },
        location
      });

      //return data;
      //this.completed(data, location);
    } else {
      throw toErrorResponse(404, 'No NFO results were received');
      //this.failed(toErrorResponse(404, 'No NFO results were received'), data);
    }
  } catch (error) {
    //this.failed(error, data);
  }
};

/*const handleFindNfo = (error: ErrorResponse, data: UI.DownloadableItemData) => {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: error.message,
  });
};*/

export const handleSearch: UI.ActionHandler<UI.DownloadableItemData> = ({ data, location }) => {
  /*const { itemInfo } = data;
  const searchString = !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

  History.pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      }
    }, 
    location
  );*/

  SearchActions.search(data.itemInfo, location);
};

const handleCopyMagnet: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const { size, tth, name } = data.itemInfo;
  const sizeParam = size > 0 ? `&xl=${size}` : '';
  const link = `magnet:?xt=urn:tree:tiger:${tth}${sizeParam}&dn=${encodeURI(name)}`;

  return (navigator as any).clipboard.writeText(link);
};

/*const handleCopyMagnet = (data: UI.DownloadableItemData) => {
  NotificationActions.info({ 
    title: data.itemInfo.name,
    message: 'Magnet link was copied to clipboard',
  });
};

DownloadableItemActions.copyMagnet.failed.listen(function (errorMessage: string) {
  NotificationActions.error({ 
    title: 'Failed to copy magnet link to clipboard',
    message: errorMessage,
  });
});*/



const DownloadableItemActions: UI.ActionListType<UI.DownloadableItemData> = {
  download: { 
    //asyncResult: true,	
    displayName: 'Download', 
    access: API.AccessEnum.DOWNLOAD, 
    icon: IconConstants.DOWNLOAD,
    filter: notSelf,
    handler: handleDownload,
  },
  downloadTo: { 
    //asyncResult: true,	
    displayName: 'Download to...',
    access: API.AccessEnum.DOWNLOAD, 
    icon: IconConstants.DOWNLOAD_TO,
    filter: notSelf,
    handler: handleDownloadTo,
  }, 
  divider: null,
  viewText: {
    //asyncResult: true,	
    displayName: 'View as text',
    access: API.AccessEnum.VIEW_FILE_EDIT, 
    icon: IconConstants.OPEN, 
    filter: viewText,
    handler: handleViewText,
  },
  viewImage: {
    //asyncResult: true,	
    displayName: 'View image',
    access: API.AccessEnum.VIEW_FILE_EDIT, 
    icon: IconConstants.OPEN, 
    filter: viewImage,
    handler: handleViewImage,
  },
  findNfo: {
    //asyncResult: true,	
    displayName: 'Find NFO',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.FIND,
    filter: findNfo,
    handler: handleFindNfo,
  },
  viewVideo: {
    //asyncResult: true,	
    displayName: 'Play video',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.OPEN,
    filter: viewVideo,
    handler: handleViewVideo,
  },
  viewAudio: {
    //asyncResult: true,	
    displayName: 'Play audio',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.OPEN,
    filter: viewAudio,
    handler: handleViewAudio,
  },
  search: {
    //asyncResult: true,	
    displayName: 'Search',
    access: API.AccessEnum.SEARCH,
    icon: IconConstants.SEARCH,
    filter: isSearchable, // Example: root directory in filelists can't be searched for
    handler: handleSearch,
  },
  copyMagnet: {
    //asyncResult: true,
    displayName: 'Copy magnet link',
    icon: IconConstants.MAGNET,
    filter: copyMagnet,
    handler: handleCopyMagnet,
  }
};


export default {
  moduleId: UI.Modules.COMMON,
  actions: DownloadableItemActions,
};
