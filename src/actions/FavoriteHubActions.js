'use strict';
import Reflux from 'reflux';
import {FAVORITE_HUB_URL } from 'constants/FavoriteHubConstants';
import SocketService from 'services/SocketService'
import ConfirmDialog from 'components/semantic/ConfirmDialog'
import NotificationActions from 'actions/NotificationActions'
import { FAVORITE_MODAL_ID } from 'constants/OverlayConstants'

import History from 'utils/History'

export const FavoriteHubActions = Reflux.createActions([
  { "connect": { 
  	asyncResult: true, 
  	displayName: "Connect" } 
  },
  { "disconnect": { 
  	asyncResult: true, 
  	displayName: "Disconnect" } 
  },
  { "create": { 
  	asyncResult: true, 
  	children: ["saved"], 
  	displayName: "New" } 
  },
  { "edit": { 
  	asyncResult: true, 
  	children: ["saved"], 
  	displayName: "Edit", 
  	icon: "edit" } 
  },
  { "update": { 
  	asyncResult: true }
  },
  { "remove": { 
  	asyncResult: true, 
  	children: ["confirmed"], 
  	displayName: "Remove", 
  	icon: "red remove circle" } 
  }
]);

FavoriteHubActions.connect.listen(function(hub) {
  let that = this;
  return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id + "/connect")
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.disconnect.listen(function(hub) {
  let that = this;
  return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id + "/disconnect")
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.create.listen(function(hub) {
	History.pushOverlay('/favorite-hubs', '/favorite-hubs/new', FAVORITE_MODAL_ID);
});

FavoriteHubActions.edit.listen(function(hub, data) {
  History.pushOverlay('/favorite-hubs', '/favorite-hubs/edit', FAVORITE_MODAL_ID, { hubEntry: hub });
});

FavoriteHubActions.update.listen(function(hub, data) {
  let that = this;
  return SocketService.patch(FAVORITE_HUB_URL + "/" + hub.id, data)
    .then(that.completed)
    .catch(this.failed);
});

FavoriteHubActions.remove.shouldEmit = function(hub) {
  const text = "Are you sure that you want to remove the favorite hub " + hub.name + "?";
  ConfirmDialog(this.displayName, text, this.icon, "Remove favorite hub", "Don't remove")
    .then(() => FavoriteHubActions.remove.confirmed(hub))
    .catch(() => {});
  return false;
};

FavoriteHubActions.remove.confirmed.listen(function(hub) {
  let that = this;
  return SocketService.delete(FAVORITE_HUB_URL + "/" + hub.id)
    .then(() => 
      FavoriteHubActions.remove.completed(hub))
    .catch((error) => 
      FavoriteHubActions.remove.failed(hub, error)
    );
});

FavoriteHubActions.remove.completed.listen(function(hub) {
  NotificationActions.success("The hub " + hub.name + " has been removed successfully");
});

FavoriteHubActions.remove.failed.listen(function(hub, error) {
  NotificationActions.error("Failed to remove the hub " + hub.name + ": " + error.message);
});

export default FavoriteHubActions;