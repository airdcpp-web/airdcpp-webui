'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';


const noData = (item: any) => !item;


const FavoriteHubActionConfig: UI.ActionConfigList<API.FavoriteHubEntry> = [
  { 'create': {
    displayName: 'Add new',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.EDIT,
  } },
  { 'remove': {
    asyncResult: true,
    displayName: 'Remove',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the favorite hub {{item.name}}?',
      approveCaption: 'Remove favorite hub',
      rejectCaption: `Don't remove`,
    }
  } },
  { 'update': { 
    asyncResult: true
  } },
];

export const FavoriteHubActions = Reflux.createActions(FavoriteHubActionConfig);

FavoriteHubActions.create.listen(function (itemData: any, location: Location) {
  History.push('/favorite-hubs/entries');
});

FavoriteHubActions.edit.listen(function (hub: API.FavoriteHubEntry, location: Location) {
  History.push(`/favorite-hubs/entries/${hub.id}`);
});

FavoriteHubActions.update.listen(function (
  this: UI.AsyncActionType<API.FavoriteHubEntry>, 
  hub: API.FavoriteHubEntry, 
  data: Partial<API.FavoriteHubEntryBase>
) {
  let that = this;
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data)
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.remove.listen(function (hub: API.FavoriteHubEntry) {
  return SocketService.delete(FavoriteHubConstants.HUBS_URL + '/' + hub.id)
    .then(() => 
      FavoriteHubActions.remove.completed(hub))
    .catch((error) => 
      FavoriteHubActions.remove.failed(error, hub)
    );
});

FavoriteHubActions.remove.completed.listen(function (hub: API.FavoriteHubEntry) {
  NotificationActions.success({ 
    title: hub.name,
    message: 'The hub was removed successfully',
  });
});

FavoriteHubActions.remove.failed.listen(function (error: ErrorResponse, hub: API.FavoriteHubEntry) {
  NotificationActions.apiError(`Failed to remove the hub ${hub.name}`, error);
});

export default {
  moduleId: UI.Modules.FAVORITE_HUBS,
  actions: FavoriteHubActions,
};
