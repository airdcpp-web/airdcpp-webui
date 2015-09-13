'use strict';
import React from 'react';
import Reflux from 'reflux';
import {BUNDLE_URL} from '../constants/QueueConstants';
import SocketService from '../services/SocketService'

import ConfirmDialog from '../components/semantic/ConfirmDialog'

export var QueueActions = Reflux.createActions([
  { "searchBundle": { asyncResult: true, displayName: "Search for alternates", icon: "search" } },
  { "setBundlePriority": { asyncResult: true, displayName: "Set priority" } },
  { "setFilePriority": { asyncResult: true, displayName: "Set priority" } },
  { "removeBundle": { asyncResult: true, children: ["confirmed"], displayName: "Remove", icon: "red remove circle" } },
  { "removeFile": { asyncResult: true, displayName: "Remove", icon: "red remove" } }
]);

QueueActions.setBundlePriority.listen(function(bundleId, newPrio) {
    var that = this;
    return SocketService.put(BUNDLE_URL + "/" + bundleId, {
    	priority: newPrio
    })
      .then(that.completed)
      .catch(this.failed);
});

QueueActions.removeBundle.shouldEmit = function(bundle) {
  var text = "Are you sure that you want to remove the bundle " + bundle.name + "?";
  ConfirmDialog(this.displayName, text, this.icon, "Remove bundle", "Don't remove").then(() => this.confirmed(bundle)).catch(() => "fasfasf");
  return false;
};

QueueActions.removeBundle.confirmed.listen(function(bundle) {
    var that = this;
    console.log("Remove succeed");
    //return SocketService.delete(BUNDLE_URL + "/" + bundleId)
    //  .then(that.completed)
    //  .catch(this.failed);
});

QueueActions.searchBundle.listen(function(bundle) {
    var that = this;
    return SocketService.post(BUNDLE_URL + "/" + bundle.id + "/search")
      .then(that.completed)
      .catch(this.failed);
});

export default QueueActions;
