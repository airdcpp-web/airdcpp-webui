import SocketService from 'services/SocketService';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleCreate: UI.ActionHandler<undefined> = ({ navigate }) => {
  navigate('/favorite-hubs/entries');
};

const handleEdit: UI.ActionHandler<API.FavoriteHubEntry> = ({
  itemData: hub,
  navigate,
}) => {
  navigate(`/favorite-hubs/entries/${hub.id}`);
};

const handleRemove: UI.ActionHandler<API.FavoriteHubEntry> = ({ itemData: hub }) => {
  return SocketService.delete(FavoriteHubConstants.HUBS_URL + '/' + hub.id);
};

export const FavoriteHubCreateAction = {
  id: 'create',
  displayName: 'Add new',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const FavoriteHubEditAction = {
  id: 'edit',
  displayName: 'Edit',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const FavoriteHubRemoveAction = {
  id: 'remove',
  displayName: 'Remove',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the favorite hub {{item.name}}?',
    approveCaption: 'Remove favorite hub',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const FavoriteHubEditActions: UI.ActionListType<API.FavoriteHubEntry> = {
  edit: FavoriteHubEditAction,
  remove: FavoriteHubRemoveAction,
};

export const FavoriteHubActionModule = {
  moduleId: UI.Modules.FAVORITE_HUBS,
};

export const FavoriteHubEditActionMenu = {
  moduleData: FavoriteHubActionModule,
  actions: FavoriteHubEditActions,
};
