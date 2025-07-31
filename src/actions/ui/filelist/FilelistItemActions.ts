import FilelistConstants from '@/constants/FilelistConstants';

import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { refreshVirtual } from '@/services/api/ShareApi';

type Filter = UI.ActionFilter<API.FilelistItem, API.FilelistSession>;

// Filters
const isMe: Filter = ({ entity }) => entity.user.flags.includes('self');
const isRoot: Filter = ({ itemData }) => itemData.path === '/';
const isPartialList: Filter = ({ entity }) => entity.partial_list;
const isDirectory: Filter = ({ itemData }) => itemData.type.id === 'directory';

const filterReload: Filter = (data) => isPartialList(data) && isDirectory(data);
const filterDetails: Filter = (data) => !isRoot(data);

// Handlers
type Handler = UI.ActionHandler<API.FilelistItem, API.FilelistSession>;

const handleReloadDirectory: Handler = ({ itemData: item, entity: session, socket }) => {
  return socket.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, {
    list_path: item.path,
    reload: true,
  });
};

const handleRefreshShare: Handler = ({ itemData, socket }) => {
  return refreshVirtual(itemData.path, socket);
};

const handleItemDetails: Handler = ({ itemData, navigate }) => {
  navigate(`item/${itemData.id}`);
};

// Actions
export const FilelistItemReloadDirectoryAction = {
  id: 'reloadDirectory',
  displayName: 'Reload',
  access: API.AccessEnum.FILELISTS_VIEW,
  icon: IconConstants.RELOAD,
  filter: filterReload,
  handler: handleReloadDirectory,
};

export const FilelistItemRefreshShareAction = {
  id: 'refreshShare',
  displayName: 'Refresh in share',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.REFRESH_COLORED,
  filter: isMe,
  handler: handleRefreshShare,
};

export const FilelistItemDetailsAction = {
  id: 'details',
  displayName: 'Details',
  icon: IconConstants.DETAILS,
  handler: handleItemDetails,
  filter: filterDetails,
};

const FilelistItemActions: UI.ActionListType<API.FilelistItem, API.FilelistSession> = {
  reloadDirectory: FilelistItemReloadDirectoryAction,
  refreshShare: FilelistItemRefreshShareAction,
  details: FilelistItemDetailsAction,
};

export const FilelistItemActionModule = {
  moduleId: UI.Modules.FILELISTS,
  subId: 'item',
};

export const FilelistItemActionMenu = {
  moduleData: FilelistItemActionModule,
  actions: FilelistItemActions,
};
