'use strict';
import Reflux from 'reflux';
import {LOG_GET_URL, MAX_LOG_MESSAGES} from 'constants/LogConstants';
import SocketService from 'services/SocketService'

export const LogActions = Reflux.createActions([
  { "fetchLastMessages": { asyncResult: true} },
    "resetLogCounters"
]);

LogActions.fetchLastMessages.listen(function() {
    let that = this;
    return SocketService.get(LOG_GET_URL + "/" + MAX_LOG_MESSAGES)
      .then(that.completed)
      .catch(this.failed);
});

export default LogActions;