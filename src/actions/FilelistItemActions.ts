'use strict';
//@ts-ignore
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';
import QueueConstants from 'constants/QueueConstants';

import ShareActions from 'actions/ShareActions';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { DownloadHandler, DownloadableItemData, DownloadableItemInfo } from './DownloadableItemActions';
import { ErrorResponse } from 'airdcpp-apisocket';


interface ActionFilelistItemData {
  item: API.FilelistItem;
  session: API.FilelistSession;
}


const isMe = ({ session }: ActionFilelistItemData) => session.user.flags.indexOf('self') !== -1;
const isPartialList = ({ session }: ActionFilelistItemData) => session.partial_list;


const FilelistItemActionConfig: UI.ActionConfigList<ActionFilelistItemData> = [
  { 'reloadDirectory': { 
    asyncResult: true,
    displayName: 'Reload',
    access: API.AccessEnum.FILELISTS_VIEW,
    icon: IconConstants.RELOAD,
    filter: isPartialList,
  } },
  { 'refreshShare': { 
    asyncResult: true,
    displayName: 'Refresh in share',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REFRESH,
    filter: isMe,
  } },
  { 'download': { asyncResult: true } },
  { 'findNfo': { asyncResult: true } },
];

const FilelistItemActions = Reflux.createActions(FilelistItemActionConfig);

const DownloadHandler: DownloadHandler<API.FilelistItem> = (itemInfo, user, downloadData) => {
  const data = {
    user,
    ...downloadData,
  };

  if (itemInfo.type.id === 'file') {
    // File
    const { tth, size, time } = itemInfo;
    Object.assign(data, {
      tth,
      size,
      time,
    });

    SocketService.post(`${QueueConstants.BUNDLES_URL}/file`, data)
      .then(FilelistItemActions.download.completed)
      .catch(error => FilelistItemActions.download.failed(error, itemInfo));

    return;
  }

  // Directory
  data['list_path'] = itemInfo.path;
  SocketService.post(FilelistConstants.DIRECTORY_DOWNLOADS_URL, data)
    .then(FilelistItemActions.download.completed)
    .catch(error => FilelistItemActions.download.failed(error, itemInfo));
};

FilelistItemActions.download.listen(DownloadHandler);

FilelistItemActions.download.failed.listen((error: ErrorResponse, itemInfo: DownloadableItemInfo) => {
  NotificationActions.apiError('Failed to queue the item ' + itemInfo.name, error);
});

FilelistItemActions.reloadDirectory.listen(function (
  this: UI.AsyncActionType<ActionFilelistItemData>, 
  itemData: ActionFilelistItemData
) {
  const { session, item } = itemData;

  let that = this;
  SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, { 
    list_path: item.path,
    reload: true,
  })
    .then(data => that.completed(session, data))
    .catch(error => that.failed(error, itemData));
});

FilelistItemActions.findNfo.listen(function (
  this: UI.AsyncActionType<ActionFilelistItemData>, 
  { user, itemInfo }: DownloadableItemData
) {
  let that = this;
  SocketService.post(FilelistConstants.FIND_NFO_URL, {
    user: {
      cid: user.cid,
      hub_url: user.hub_url,
    },
    directory: itemInfo.path,
  })
    .then((data) => that.completed(user, itemInfo, data))
    .catch(that.failed);
});

FilelistItemActions.refreshShare.listen(function ({ session, item }: ActionFilelistItemData) {
  ShareActions.actions.refreshVirtual(item.path, session.share_profile!.id);
});

export default {
  moduleId: UI.Modules.FILELISTS,
  subId: 'item',
  actions: FilelistItemActions,
} as UI.ModuleActions<ActionFilelistItemData>;
