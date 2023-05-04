import SocketService from 'services/SocketService';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleCreate: UI.ActionHandler<undefined> = ({ navigate }) => {
  navigate(`directories`);
};

const handleEdit: UI.ActionHandler<API.FavoriteDirectoryEntry> = ({
  data: directory,
  navigate,
}) => {
  navigate(`directories/${directory.id}`);
};

const handleRemove: UI.ActionHandler<API.FavoriteDirectoryEntry> = ({
  data: directory,
}) => {
  return SocketService.delete(
    `${FavoriteDirectoryConstants.DIRECTORIES_URL}/${directory.id}`
  );
};

const FavoriteDirectoryCreateActions: UI.ActionListType<undefined> = {
  create: {
    displayName: 'Add directory',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.CREATE,
    handler: handleCreate,
  },
};

const FavoriteDirectoryEditActions: UI.ActionListType<API.FavoriteDirectoryEntry> = {
  edit: {
    displayName: 'Edit directory',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.EDIT,
    handler: handleEdit,
  },
  remove: {
    displayName: 'Remove directory',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content:
        'Are you sure that you want to remove the favorite directory {{item.name}}?',
      approveCaption: 'Remove directory',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  },
};

export default {
  create: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'favoriteDirectory',
    actions: FavoriteDirectoryCreateActions,
  },
  edit: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'favoriteDirectory',
    actions: FavoriteDirectoryEditActions,
  },
};
