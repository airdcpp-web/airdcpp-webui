import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleCreate: UI.ActionHandler<undefined> = ({ navigate }) => {
  navigate(`directories`);
};

const handleEdit: UI.ActionHandler<API.FavoriteDirectoryEntry> = ({
  itemData: directory,
  navigate,
}) => {
  navigate(`directories/${directory.id}`);
};

const handleRemove: UI.ActionHandler<API.FavoriteDirectoryEntry> = ({
  itemData: directory,
  socket,
}) => {
  return socket.delete(`${FavoriteDirectoryConstants.DIRECTORIES_URL}/${directory.id}`);
};

export const FavoriteDirectoryCreateAction = {
  id: 'create',
  displayName: 'Add directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const FavoriteDirectoryEditAction = {
  id: 'edit',
  displayName: 'Edit directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const FavoriteDirectoryRemoveAction = {
  id: 'remove',
  displayName: 'Remove directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the favorite directory {{item.name}}?',
    approveCaption: 'Remove directory',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const FavoriteDirectoryEditActions: UI.ActionListType<API.FavoriteDirectoryEntry> = {
  edit: FavoriteDirectoryEditAction,
  remove: FavoriteDirectoryRemoveAction,
};

export const FavoriteDirectoryActionModule = {
  moduleId: UI.Modules.SETTINGS,
  subId: 'favoriteDirectory',
};

export const FavoriteDirectoryEditActionMenu = {
  moduleData: FavoriteDirectoryActionModule,
  actions: FavoriteDirectoryEditActions,
};
