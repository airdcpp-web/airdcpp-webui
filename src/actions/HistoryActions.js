'use strict';
import Reflux from 'reflux';
import HistoryConstants from 'constants/HistoryConstants';
import SocketService from 'services/SocketService';

export const HistoryActions = Reflux.createActions([
  { 'add': { asyncResult: true } },
]);

HistoryActions.add.listen(function (historyId, string) {
  let that = this;
  return SocketService.post(HistoryConstants.STRINGS_URL + '/' + historyId, { 
    string,
  })
    .then(that.completed)
    .catch(that.failed);
});

export default HistoryActions;
