'use strict';
import Reflux from 'reflux';
import {FAVORITE_HUB_URL} from '../constants/FavoriteHubConstants';
import SocketService from '../services/SocketService'
import ConfirmDialog from '../components/semantic/ConfirmDialog'

import History from '../utils/History'

export var FavoriteHubActions = Reflux.createActions([
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
    var that = this;
    return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id + "/connect")
      .then(that.completed)
      .catch(this.failed);
});

FavoriteHubActions.disconnect.listen(function(hub) {
    var that = this;
    return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id + "/disconnect")
      .then(that.completed)
      .catch(this.failed);
});

FavoriteHubActions.create.listen(function(hub, data) {
	History.pushState({ modal: true }, '/favorite-hubs/new');
    //var that = this;
    //return SocketService.post(FAVORITE_HUB_URL, data)
    //  .then(that.completed)
    //  .catch(this.failed);
});

FavoriteHubActions.edit.listen(function(hub, data) {
	History.pushState({ modal: true, hubEntry: hub }, '/favorite-hubs/edit');
    //var that = this;
    //return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id, data)
    //  .then(that.completed)
    //  .catch(this.failed);
});

FavoriteHubActions.update.listen(function(hub, data) {
    var that = this;
    return SocketService.post(FAVORITE_HUB_URL + "/" + hub.id, data)
      .then(that.completed)
      .catch(this.failed);
});

FavoriteHubActions.remove.shouldEmit = function(hub) {
  var text = "Are you sure that you want to remove the favorite hub " + hub.name + "?";
  ConfirmDialog(this.displayName, text, this.icon, "Remove favorite hub", "Don't remove").then(() => this.confirmed(hub)).catch(() => "fasfasf");
  return false;
};

FavoriteHubActions.remove.confirmed.listen(function(hub) {
    var that = this;
    return SocketService.delete(FAVORITE_HUB_URL + "/" + hub.id)
      .then(that.completed)
      .catch(this.failed);
});

export default FavoriteHubActions;