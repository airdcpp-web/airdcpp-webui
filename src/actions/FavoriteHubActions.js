'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import ConfirmDialog from 'components/semantic/ConfirmDialog';
import NotificationActions from 'actions/NotificationActions';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import History from 'utils/History';


const noData = item => !item;

export const FavoriteHubActions = Reflux.createActions([
  { 'create': {
    displayName: 'Add new',
    access: AccessConstants.FAVORITE_HUBS_EDIT,
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit',
    access: AccessConstants.FAVORITE_HUBS_EDIT,
    icon: IconConstants.EDIT,
  } },
  { 'remove': {
    asyncResult: true,
    children: [ 'confirmed' ],
    displayName: 'Remove',
    access: AccessConstants.FAVORITE_HUBS_EDIT,
    icon: IconConstants.REMOVE,
  } },
  { 'update': { 
    asyncResult: true
  } },
]);

FavoriteHubActions.create.listen(function (location) {
  History.push('/favorite-hubs/entries');
});

FavoriteHubActions.edit.listen(function (hub, location) {
  History.push(`/favorite-hubs/entries/${hub.id}`);
});

FavoriteHubActions.update.listen(function (hub, data) {
  let that = this;
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data)
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.remove.shouldEmit = function (hub) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the favorite hub ' + hub.name + '?',
    icon: this.icon,
    approveCaption: 'Remove favorite hub',
    rejectCaption: "Don't remove",
  };

  ConfirmDialog(options, this.confirmed.bind(this, hub));
  return false;
};

FavoriteHubActions.remove.confirmed.listen(function (hub) {
  return SocketService.delete(FavoriteHubConstants.HUBS_URL + '/' + hub.id)
    .then(() => 
      FavoriteHubActions.remove.completed(hub))
    .catch((error) => 
      FavoriteHubActions.remove.failed(hub, error)
    );
});

FavoriteHubActions.remove.completed.listen(function (hub) {
  NotificationActions.success({ 
    title: hub.name,
    message: 'The hub was removed successfully',
  });
});

FavoriteHubActions.remove.failed.listen(function (hub, error) {
  NotificationActions.apiError('Failed to remove the hub ' + hub.name, error);
});

export default FavoriteHubActions;
