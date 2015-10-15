'use strict';
import Reflux from 'reflux';
import {FILELIST_SESSIONS_URL, FILELIST_SESSION_URL} from 'constants/FilelistConstants';
import SocketService from 'services/SocketService'

import History from 'utils/History'
import FilelistSessionStore from 'stores/FilelistSessionStore'
import NotificationActions from 'actions/NotificationActions'

const FilelistActions = Reflux.createActions([
  { "fetchSessions": { asyncResult: true} },
  { "createSession": { asyncResult: true } },
  { "removeSession": { asyncResult: true } },
    "sessionChanged"
]);

FilelistActions.fetchSessions.listen(function() {
    let that = this;
    return SocketService.get(FILELIST_SESSIONS_URL)
      .then(that.completed)
      .catch(that.failed);
});

FilelistActions.createSession.listen(function(user, location) {
	let session = FilelistSessionStore.getSession(user.cid);
	if (session) {
		this.completed(session, user, location);
		return;
	}

    let that = this;
    return SocketService.post(FILELIST_SESSION_URL, { 
    	cid: user.cid,
    	hub_url: user.hub_url
    })
      .then((data) => that.completed(data, user, location))
      .catch(that.failed);
});

FilelistActions.createSession.completed.listen(function(data, user, location) {
    History.pushSidebar(location, "messages/session/" + user.cid);
});

FilelistActions.createSession.failed.listen(function(error) {
  NotificationActions.error({ 
    title: "Failed to create filelist session",
    message: error.message
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
    message: error.message
  });
});

export default FilelistActions;