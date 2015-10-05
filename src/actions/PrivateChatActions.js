'use strict';
import Reflux from 'reflux';
import {PRIVATE_CHAT_SESSIONS_URL, PRIVATE_CHAT_SESSION_URL} from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService'

import History from 'utils/History'

export const PrivateChatActions = Reflux.createActions([
  { "fetchSessions": { asyncResult: true} },
  { "createSession": { asyncResult: true } },
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
      .catch(this.failed);
});

PrivateChatActions.createSession.listen(function(user, location) {
    let that = this;
    return SocketService.post(PRIVATE_CHAT_SESSION_URL, { 
    	cid: user.cid,
    	hub_url: user.hub_url
    })
      .then((data) => that.completed(data, user, location))
      .catch(this.failed);
});

PrivateChatActions.createSession.completed.listen(function(data, user, location) {
    History.pushSidebar(location, "messages/session/" + user.cid);
});

export default PrivateChatActions;