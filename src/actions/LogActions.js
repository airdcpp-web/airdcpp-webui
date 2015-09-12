'use strict';
import Reflux from 'reflux';
import {LOG_GET_URL, MAX_LOG_MESSAGES} from '../constants/LogConstants';
import SocketService from '../services/SocketService'

export var LogActions = Reflux.createActions([
  { "fetchLastMessages": { asyncResult: true} },
    "resetLogCounters"
]);

LogActions.fetchLastMessages.listen(function() {
    var that = this;
    return SocketService.get(LOG_GET_URL + "/" + MAX_LOG_MESSAGES)
      .then(that.completed)
      .catch(this.failed);
});

export default LogActions;

/*LogActions.getLastLogs.listenAndPromise(() => {
    SocketService.get(this.apiUrl + "/logs/" + MAX_LOG_MESSAGES);
});*/


/*import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {RESET_LOG_COUNTERS} from '../constants/MainConstants';

export default {
  resetLogCounters: () => {
    AppDispatcher.dispatch({
      actionType: RESET_LOG_COUNTERS
    })
  },

  gotBundles: (json) => {
    AppDispatcher.dispatch({
      actionType: BUNDLES_GET,
      bundles: json
    })
  }
}*/