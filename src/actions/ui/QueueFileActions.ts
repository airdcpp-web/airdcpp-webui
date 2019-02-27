'use strict';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

//import DownloadableItemActions from './DownloadableItemActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchActions from 'actions/reflux/SearchActions';

//import { ErrorResponse } from 'airdcpp-apisocket';
//import { Location } from 'history';


const itemNotFinished = (item: API.QueueFile) => item.time_finished === 0;


const handleSearch: UI.ActionHandler<API.QueueFile> = ({ data: itemInfo, location }) => {
  SearchActions.search(itemInfo, location);

  //return DownloadableItemActions.actions.search(data, { 
  //  data: itemInfo,
  //  location
  //});
};

const handleRemoveFile: UI.ActionHandler<API.QueueFile> = (
  { data: file },
  removeFinished: boolean
) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/remove`, {
    remove_finished: removeFinished,
  });
};

/*QueueFileActions.removeFile.completed.listen(function ({ name }: API.QueueFile) {
  NotificationActions.success({ 
    title: name,
    message: 'File was removed from queue',
  });
});

QueueFileActions.removeFile.failed.listen(function ({ name }: API.QueueFile, error: ErrorResponse) {
  NotificationActions.apiError(name, error);
});*/

const handleSearchFileAlternates: UI.ActionHandler<API.QueueFile> = ({ data: file }) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/search`);
};

/*QueueFileActions.searchFileAlternates.completed.listen(function (file: API.QueueFile) {
  NotificationActions.success({ 
    title: file.name,
    message: 'File was searched for alternates',
  });
});

const searchFileAlternates = (file: API.QueueFile, error: ErrorResponse) => {
  NotificationActions.error({ 
    title: file.name,
    message: 'Failed to search the file for alternates: ' + error.message,
  });
};*/

/*const handleSetFilePriority: UI.ActionHandler<API.QueueFile> = (
  file: API.QueueFile, 
  priority: API.QueuePriorityEnum
) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/priority`, {
    priority
  });
};*/



const QueueFileActions: UI.ActionListType<API.QueueFile> = {
  search: {
    access: API.AccessEnum.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
    handler: handleSearch,
  },
  searchFileAlternates: {
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
    handler: handleSearchFileAlternates,
  },
  removeFile: { 
    displayName: 'Remove',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the file {{item.name}}?',
      approveCaption: 'Remove file',
      rejectCaption: `Don't remove`,
      checkboxCaption: 'Remove on disk',
    },
    handler: handleRemoveFile,
  },
};


export default {
  moduleId: UI.Modules.QUEUE,
  //subId: 'file',
  actions: QueueFileActions,
} as UI.ModuleActions<API.QueueFile>;
