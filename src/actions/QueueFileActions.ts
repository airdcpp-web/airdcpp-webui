'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import DownloadableItemActions from 'actions/DownloadableItemActions';
import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const itemNotFinished = (item: API.QueueFile) => item.time_finished === 0;


const QueueFileActionConfig: UI.ActionConfigList<API.QueueFile> = [
  { 'search': { 
    asyncResult: true,
    access: API.AccessEnum.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
  } },
  { 'searchFileAlternates': { 
    asyncResult: true,
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
  } },
  { 'setFilePriority': { 
    asyncResult: true,
  } },
  { 'removeFile': { 
    asyncResult: true,
    displayName: 'Remove',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the file {{item.name}}?',
      approveCaption: 'Remove file',
      rejectCaption: `Don't remove`,
      checkboxCaption: 'Remove on disk',
    }
  } },
];

const QueueFileActions = Reflux.createActions(QueueFileActionConfig);

QueueFileActions.search.listen(function (itemInfo: API.QueueFile, location: Location) {
  return DownloadableItemActions.actions.search({ itemInfo }, location);
});

QueueFileActions.removeFile.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  item: API.QueueFile, 
  location: any,
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

export default {
  moduleId: UI.Modules.QUEUE,
  //subId: 'file',
  actions: QueueFileActions,
} as UI.ModuleActions<API.QueueFile>;
