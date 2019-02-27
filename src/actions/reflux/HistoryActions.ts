'use strict';
//@ts-ignore
import Reflux from 'reflux';
import HistoryConstants from 'constants/HistoryConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


export const HistoryActions = Reflux.createActions([
  { 'add': { asyncResult: true } },
]);

HistoryActions.add.listen(function (
  this: UI.AsyncActionType<API.FilelistSession>, 
  historyId: string, 
  text: string
) {
  let that = this;
  return SocketService.post(HistoryConstants.STRINGS_URL + '/' + historyId, { 
    string: text,
  })
    .then(that.completed)
    .catch(that.failed);
});

export default HistoryActions as UI.RefluxActionListType<void>;
