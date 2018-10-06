'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import DownloadableItemActions from 'actions/DownloadableItemActions';
import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const itemNotFinished = (item: API.QueueFile) => item.time_finished === 0;


const QueueFileActions = Reflux.createActions([
  { 'search': { 
    asyncResult: true,
    access: AccessConstants.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
  } },
  { 'searchFileAlternates': { 
    asyncResult: true,
    access: AccessConstants.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
  } },
  { 'setFilePriority': { 
    asyncResult: true,
  } },
  { 'removeFile': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.REMOVE,
  } },
] as UI.ActionConfigList<API.QueueFile>);

QueueFileActions.search.listen(function (itemInfo: API.QueueFile, location: Location) {
  return DownloadableItemActions.search({ itemInfo }, location);
});

QueueFileActions.removeFile.shouldEmit = function (file: API.QueueFile) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the file ' + file.name + '?',
    icon: this.icon,
    approveCaption: 'Remove file',
    rejectCaption: `Don't remove`,
    checkboxCaption: 'Remove on disk',
  };

  ConfirmDialog(options, this.confirmed.bind(this, file));
  return false;
};

QueueFileActions.removeFile.confirmed.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  item: API.QueueFile, 
  removeFinished: boolean
) {
  const that = this;
  return SocketService.post(`${QueueConstants.FILES_URL}/${item.id}/remove`, {
    remove_finished: removeFinished,
  })
    .then(QueueFileActions.removeFile.completed.bind(that, item))
    .catch(QueueFileActions.removeFile.failed.bind(that, item));
});

QueueFileActions.removeFile.completed.listen(function ({ name }: API.QueueFile) {
  NotificationActions.success({ 
    title: name,
    message: 'File was removed from queue',
  });
});

QueueFileActions.removeFile.failed.listen(function ({ name }: API.QueueFile, error: ErrorResponse) {
  NotificationActions.apiError(name, error);
});

QueueFileActions.searchFileAlternates.listen(function (this: UI.AsyncActionType<API.QueueFile>, file: API.QueueFile) {
  let that = this;
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/search`)
    .then(that.completed.bind(that, file))
    .catch(this.failed.bind(that, file));
});

QueueFileActions.searchFileAlternates.completed.listen(function (file: API.QueueFile) {
  NotificationActions.success({ 
    title: file.name,
    message: 'File was searched for alternates',
  });
});

QueueFileActions.searchFileAlternates.failed.listen(function (file: API.QueueFile, error: ErrorResponse) {
  NotificationActions.error({ 
    title: file.name,
    message: 'Failed to search the file for alternates: ' + error.message,
  });
});

QueueFileActions.setFilePriority.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  file: API.QueueFile, 
  priority: API.QueuePriorityEnum
) {
  let that = this;
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/priority`, {
    priority
  })
    .then(that.completed.bind(that, file))
    .catch(that.failed.bind(that, file));
});

export default QueueFileActions;
