import QueueConstants from 'constants/QueueConstants';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { searchForeground } from 'utils/SearchUtils';

type Filter = UI.ActionFilter<API.QueueFile>;
const itemNotFinished: Filter = ({ itemData: file }) => file.time_finished === 0;

type Handler = UI.ActionHandler<API.QueueFile>;
const handleSearch: Handler = ({ itemData: file, location, navigate }) => {
  return searchForeground(file, location, navigate);
};

const handleRemoveFile: Handler = (
  { itemData: file, socket },
  removeFinished: boolean,
) => {
  return socket.post(`${QueueConstants.FILES_URL}/${file.id}/remove`, {
    remove_finished: removeFinished,
  });
};

const handleSearchFileAlternates: Handler = ({ itemData: file, socket }) => {
  return socket.post(`${QueueConstants.FILES_URL}/${file.id}/search`);
};

export const QueueFileSearchAction = {
  id: 'search',
  displayName: 'Search (foreground)',
  access: API.AccessEnum.SEARCH,
  icon: IconConstants.SEARCH,
  handler: handleSearch,
};

export const QueueFileSearchAlternatesAction = {
  id: 'searchAlternates',
  displayName: 'Search for alternates',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.SEARCH_ALTERNATES,
  filter: itemNotFinished,
  handler: handleSearchFileAlternates,
};

export const QueueFileRemoveAction = {
  id: 'remove',
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
};

const QueueFileActions: UI.ActionListType<API.QueueFile> = {
  search: QueueFileSearchAction,
  searchFileAlternates: QueueFileSearchAlternatesAction,
  removeFile: QueueFileRemoveAction,
};

export const QueueFileActionModule = {
  moduleId: UI.Modules.QUEUE,
  subId: 'file',
};

export const QueueFileActionMenu = {
  moduleData: QueueFileActionModule,
  actions: QueueFileActions,
};
