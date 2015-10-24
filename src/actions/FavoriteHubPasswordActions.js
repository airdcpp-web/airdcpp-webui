'use strict';
import Reflux from 'reflux';

import {FAVORITE_HUB_URL } from 'constants/FavoriteHubConstants';
import SocketService from 'services/SocketService'
import PasswordDialog from 'components/semantic/PasswordDialog'
import NotificationActions from 'actions/NotificationActions'

const sendPassword = (hub, password, action) => {
  return SocketService.patch(FAVORITE_HUB_URL + "/" + hub.id, {password: password})
    .then(() => 
      action.completed(hub))
    .catch((error) => 
      action.failed(hub, error)
    );
}

const FavoriteHubPasswordActions = Reflux.createActions([
  { "create": { 
  	asyncResult: true, 
  	children: ["saved"], 
  	displayName: "Set password",
    icon: "lock" } 
  },
  { "change": { 
  	asyncResult: true, 
  	children: ["saved"], 
  	displayName: "Change password", 
  	icon: "edit" } 
  },
  { "remove": { 
  	asyncResult: true, 
  	//children: ["confirmed"], 
  	displayName: "Remove password", 
  	icon: "red remove circle" } 
  }
]);

FavoriteHubPasswordActions.create.listen(function(hub) {
  const text = "Set password for the hub " + hub.name;
  PasswordDialog("Set password", text)
    .then((password) => FavoriteHubPasswordActions.create.saved(hub, password))
    .catch(() => {});
});

FavoriteHubPasswordActions.create.saved.listen(function(hub, password) {
  sendPassword(hub, password, FavoriteHubPasswordActions.create);
});

FavoriteHubPasswordActions.change.listen(function(hub) {
  const text = "Enter new password for the hub " + hub.name;
  PasswordDialog("Change password", text)
    .then((password) => FavoriteHubPasswordActions.change.saved(hub, password))
    .catch(() => {});
});

FavoriteHubPasswordActions.change.saved.listen(function(hub, password) {
  sendPassword(hub, password, FavoriteHubPasswordActions.change);
});

FavoriteHubPasswordActions.remove.listen(function(hub) {
  sendPassword(hub, null, FavoriteHubPasswordActions.remove);
});

export default FavoriteHubPasswordActions;