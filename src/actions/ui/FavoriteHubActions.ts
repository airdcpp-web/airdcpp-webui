'use strict';

import SocketService from 'services/SocketService';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';


const handleCreate = () => {
  History.push('/favorite-hubs/entries');
};

const handleEdit: UI.ActionHandler<API.FavoriteHubEntry> = ({ data: hub }) => {
  History.push(`/favorite-hubs/entries/${hub.id}`);
};

/*FavoriteHubActions.update.listen(function (
  hub: API.FavoriteHubEntry, 
  data: Partial<API.FavoriteHubEntryBase>
) {
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data);
});*/

const handleRemove: UI.ActionHandler<API.FavoriteHubEntry> = ({ data: hub }) => {
  return SocketService.delete(FavoriteHubConstants.HUBS_URL + '/' + hub.id);
};

/*FavoriteHubActions.remove.completed.listen(function (hub: API.FavoriteHubEntry) {
  NotificationActions.success({ 
    title: hub.name,
    message: 'The hub was removed successfully',
  });
});

FavoriteHubActions.remove.failed.listen(function (error: ErrorResponse, hub: API.FavoriteHubEntry) {
  NotificationActions.apiError(`Failed to remove the hub ${hub.name}`, error);
});*/



const FavoriteHubCreateActions: UI.ActionListType<{}> = {
  create: {
    displayName: 'Add new',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.CREATE,
    handler: handleCreate,
  },
};

const FavoriteHubEditActions: UI.ActionListType<API.FavoriteHubEntry> = {
  edit: { 
    displayName: 'Edit',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.EDIT,
    handler: handleEdit,
  },
  remove: {
    displayName: 'Remove',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the favorite hub {{item.name}}?',
      approveCaption: 'Remove favorite hub',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  },
  /*update: { 
    asyncResult: true
  },*/
};


export default {
  create: {
    moduleId: UI.Modules.FAVORITE_HUBS,
    actions: FavoriteHubCreateActions,
  },
  edit: {
    moduleId: UI.Modules.FAVORITE_HUBS,
    actions: FavoriteHubEditActions,
  }
};
