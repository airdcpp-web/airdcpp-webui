'use strict';
import Reflux from 'reflux';
import {PRIVATE_CHAT_SESSIONS_URL} from 'constants/PrivateChatConstants';
import SocketService from 'services/SocketService'

export const PrivateChatActions = Reflux.createActions([
  { "fetchSessions": { asyncResult: true} },
    "resetLogCounters"
]);

PrivateChatActions.fetchSessions.listen(function() {
    let that = this;
    return SocketService.get(PRIVATE_CHAT_SESSIONS_URL)
      .then(that.completed)
      .catch(this.failed);
});

export default PrivateChatActions;