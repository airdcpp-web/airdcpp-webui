'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { ErrorResponse } from 'airdcpp-apisocket';


const noData = (item: any) => !item;

export const FavoriteHubActions = Reflux.createActions([
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
    children: [ 'confirmed' ],
    displayName: 'Remove',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.REMOVE,
  } },
  { 'update': { 
    asyncResult: true
  } },
] as UI.ActionConfigList<API.FavoriteHubEntry>);

FavoriteHubActions.create.listen(function (location: Location) {
  History.push('/favorite-hubs/entries');
});

FavoriteHubActions.edit.listen(function (hub: API.FavoriteHubEntry, location: Location) {
  History.push(`/favorite-hubs/entries/${hub.id}`);
});

FavoriteHubActions.update.listen(function (
  this: UI.AsyncActionType<API.FavoriteHubEntry>, 
  hub: API.FavoriteHubEntry, 
  data: API.FavoriteHubEntryBase
) {
  let that = this;
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data)
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.remove.shouldEmit = function (
  this: UI.ConfirmActionType<API.FavoriteHubEntry>, 
  hub: API.FavoriteHubEntry
) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the favorite hub ' + hub.name + '?',
    icon: this.icon,
    approveCaption: 'Remove favorite hub',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, hub));
  return false;
};

FavoriteHubActions.remove.confirmed.listen(function (hub: API.FavoriteHubEntry) {
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

export default FavoriteHubActions;
