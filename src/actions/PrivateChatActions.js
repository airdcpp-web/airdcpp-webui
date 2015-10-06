'use strict';
import Reflux from 'reflux';
import {PRIVATE_CHAT_SESSIONS_URL, PRIVATE_CHAT_SESSION_URL} from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService'

import History from 'utils/History'
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import NotificationActions from 'actions/NotificationActions'

export const PrivateChatActions = Reflux.createActions([
  { "fetchSessions": { asyncResult: true} },
  { "createSession": { asyncResult: true } },
  { "removeSession": { asyncResult: true } },
  { "sendMessage": { asyncResult: true } },
  	"setRead",
    "resetLogCounters"
]);

PrivateChatActions.fetchSessions.listen(function() {
    let that = this;
    return SocketService.get(PRIVATE_CHAT_SESSIONS_URL)
      .then(that.completed)
      .catch(this.failed);
});

PrivateChatActions.setRead.listen(function(cid) {
    let that = this;
    return SocketService.post(PRIVATE_CHAT_SESSION_URL + "/" + cid + "/read")
      .then(that.completed)
      .catch(that.failed);
});

PrivateChatActions.createSession.listen(function(user, location) {
	let session = PrivateChatSessionStore.getSession(user.cid);
	if (session) {
		this.completed(session, user, location);
		return;
	}

    let that = this;
    return SocketService.post(PRIVATE_CHAT_SESSION_URL, { 
    	cid: user.cid,
    	hub_url: user.hub_url
    })
      .then((data) => that.completed(data, user, location))
      .catch(that.failed);
});

PrivateChatActions.createSession.completed.listen(function(data, user, location) {
    History.pushSidebar(location, "messages/session/" + user.cid);
});

PrivateChatActions.createSession.failed.listen(function(error) {
	NotificationActions.error("Failed to create chat session: " + error.message);
});

PrivateChatActions.removeSession.listen(function(cid) {
    let that = this;
    return SocketService.delete(PRIVATE_CHAT_SESSION_URL + "/" + cid)
      .then(that.completed)
      .catch(that.failed);
});

PrivateChatActions.removeSession.failed.listen(function(error) {
	NotificationActions.error("Failed to remove chat session: " + error.message);
});

PrivateChatActions.sendMessage.listen(function(cid, message) {
    let that = this;
    return SocketService.post(PRIVATE_CHAT_SESSION_URL + "/" + cid + "/message", { message: message })
      .then(that.completed)
      .catch(that.failed);
});

PrivateChatActions.sendMessage.failed.listen(function(error) {
	NotificationActions.error("Failed to send message: " + error.message);
});

export default PrivateChatActions;