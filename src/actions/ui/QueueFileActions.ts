import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchActions from 'actions/reflux/SearchActions';

const itemNotFinished = (item: API.QueueFile) => item.time_finished === 0;

const handleSearch: UI.ActionHandler<API.QueueFile> = ({
  data: itemInfo,
  location,
  navigate,
}) => {
  return SearchActions.search(itemInfo, location, navigate);
};

const handleRemoveFile: UI.ActionHandler<API.QueueFile> = (
  { data: file },
  removeFinished: boolean,
) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/remove`, {
    remove_finished: removeFinished,
  });
};

const handleSearchFileAlternates: UI.ActionHandler<API.QueueFile> = ({ data: file }) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/search`);
};

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
    notifications: {
      onSuccess: 'File {{item.name}} was searched for alternates',
    },
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
    notifications: {
      onSuccess: 'File {{item.name}} was removed from queue',
    },
  },
};

export default {
  moduleId: UI.Modules.QUEUE,
  //subId: 'file',
  actions: QueueFileActions,
} as UI.ModuleActions<API.QueueFile>;
