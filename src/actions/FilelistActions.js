'use strict';
import Reflux from 'reflux';
import {FILELIST_SESSIONS_URL, FILELIST_SESSION_URL, FILELIST_MODULE_URL} from 'constants/FilelistConstants';
import {BUNDLE_URL} from 'constants/QueueConstants';

import SocketService from 'services/SocketService'

import History from 'utils/History'
import FilelistSessionStore from 'stores/FilelistSessionStore'
import NotificationActions from 'actions/NotificationActions'

const FilelistActions = Reflux.createActions([
  { "fetchSessions": { asyncResult: true} },
  { "createSession": { asyncResult: true } },
  { "removeSession": { asyncResult: true } },
  { "changeDirectory": { asyncResult: true } },
  { "download": { asyncResult: true } },
    "sessionChanged"
]);

FilelistActions.download.listen((itemData, downloadData) => {
  downloadData["user"] = itemData.parentEntity.user;
  if (itemData.itemInfo.type.id === "file") {
    downloadData["target"] += itemData.itemInfo.name;
    downloadData["tth"] = itemData.itemInfo.tth;
    downloadData["size"] = itemData.itemInfo.size;
    downloadData["time"] = itemData.itemInfo.time;
    return SocketService.post(BUNDLE_URL + '/file', downloadData)
      .then(FilelistActions.download.completed)
      .catch(error => FilelistActions.download.failed(itemData, error));
  }

  // Directory
  downloadData["list_path"] = itemData.itemInfo.path;
  return SocketService.post(FILELIST_MODULE_URL + '/download_directory', downloadData)
    .then(FilelistActions.download.completed)
    .catch(error => FilelistActions.download.failed(itemData, error));
});

FilelistActions.download.failed.listen((itemData, error) => {
  NotificationActions.error({
    title: itemData.itemInfo.name,
    message: "Failed to queue the item: " + error.reason
  });
});

FilelistActions.fetchSessions.listen(function() {
    let that = this;
    return SocketService.get(FILELIST_SESSIONS_URL)
      .then(that.completed)
      .catch(that.failed);
});

FilelistActions.changeDirectory.listen(function(cid, path) {
  let that = this;
  SocketService.post(FILELIST_SESSION_URL + "/" + cid + "/directory", { list_path: path })
    .then(data => that.completed(cid, data))
    .catch(error => that.failed(cid, error));
});

FilelistActions.createSession.listen(function(user, location, directory = '/') {
	let session = FilelistSessionStore.getSession(user.cid);
	if (session) {
		this.completed(session, user, location);
		return;
	}

  let that = this;
  return SocketService.post(FILELIST_SESSION_URL, {
    client_view: true,
    user: {
      cid: user.cid,
      hub_url: user.hub_url
    },
    directory: directory
  })
    .then((data) => that.completed(data, user, location))
    .catch(that.failed);
});

FilelistActions.createSession.completed.listen(function(data, user, location) {
    History.pushSidebar(location, "filelists/session/" + user.cid);
});

FilelistActions.createSession.failed.listen(function(error) {
  NotificationActions.error({ 
    title: "Failed to create filelist session",
    message: error.reason
  });
});

FilelistActions.removeSession.listen(function(cid) {
    let that = this;
    return SocketService.delete(FILELIST_SESSION_URL + "/" + cid)
      .then(that.completed)
      .catch(that.failed);
});

FilelistActions.removeSession.failed.listen(function(error) {
  NotificationActions.error({ 
    title: "Failed to remove filelist",
    message: error.reason
  });
});

export default FilelistActions;