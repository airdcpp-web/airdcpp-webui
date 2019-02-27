'use strict';
//@ts-ignore
import Reflux from 'reflux';

import FilelistConstants from 'constants/FilelistConstants';
import QueueConstants from 'constants/QueueConstants';

import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';


interface ActionFilelistItemData {
  item: API.FilelistItem;
  session: API.FilelistSession;
}


const FilelistItemActionConfig: UI.RefluxActionConfigList<ActionFilelistItemData> = [
  { 'download': { asyncResult: true } },
  { 'findNfo': { asyncResult: true } },
];

const FilelistItemActions = Reflux.createActions(FilelistItemActionConfig);

const DownloadHandler: UI.DownloadHandler<API.FilelistItem> = (itemInfo, user, downloadData) => {
  const data = {
    user,
    ...downloadData,
  };

  if (itemInfo.type.id === 'file') {
    // File
    const { tth, size, time } = itemInfo;
    SocketService.post(`${QueueConstants.BUNDLES_URL}/file`, {
      ...data,
      tth,
      size,
      time,
    })
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

FilelistItemActions.download.failed.listen((error: ErrorResponse, itemInfo: UI.DownloadableItemInfo) => {
  NotificationActions.apiError('Failed to queue the item ' + itemInfo.name, error);
});

FilelistItemActions.findNfo.listen(function (
  this: UI.AsyncActionType<ActionFilelistItemData>, 
  { user, itemInfo }: UI.DownloadableItemData
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

export default FilelistItemActions as UI.RefluxActionListType<void>;
