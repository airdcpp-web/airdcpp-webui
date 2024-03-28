import FilelistConstants from 'constants/FilelistConstants';

import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { refreshVirtual } from 'services/api/ShareApi';

interface ActionFilelistItemData {
  item: API.FilelistItem;
  session: API.FilelistSession;
}

const isMe = ({ session }: ActionFilelistItemData) => session.user.flags.includes('self');
const isRoot = ({ item }: ActionFilelistItemData) => item.path === '/';
const isPartialList = ({ session }: ActionFilelistItemData) => session.partial_list;
const isDirectory = ({ item }: ActionFilelistItemData) => item.type.id === 'directory';

const filterReload = (data: ActionFilelistItemData) =>
  isPartialList(data) && isDirectory(data);
const filterDetails = (data: ActionFilelistItemData) => !isRoot(data);

const handleReloadDirectory: UI.ActionHandler<ActionFilelistItemData> = ({ data }) => {
  const { session, item } = data;

  return SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, {
    list_path: item.path,
    reload: true,
  });
};

const handleRefreshShare: UI.ActionHandler<ActionFilelistItemData> = ({ data }) => {
  return refreshVirtual(data.item.path);
};

const handleItemDetails: UI.ActionHandler<ActionFilelistItemData> = ({
  data,
  navigate,
}) => {
  navigate(`item/${data.item.id}`);
};

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

const FilelistItemActions: UI.ActionListType<ActionFilelistItemData> = {
  reloadDirectory: FilelistItemReloadDirectoryAction,
  refreshShare: FilelistItemRefreshShareAction,
  details: FilelistItemDetailsAction,
};

export default {
  moduleId: UI.Modules.FILELISTS,
  subId: 'item',
  actions: FilelistItemActions,
};
