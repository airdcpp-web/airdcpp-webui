'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


const QueueFileActionConfig: UI.RefluxActionConfigList<API.QueueFile> = [
  { 'setFilePriority': { 
    asyncResult: true,
  } },
  /*{ 'removeFile': { 
    asyncResult: true,
  } },*/
];

const QueueFileActions = Reflux.createActions(QueueFileActionConfig);

QueueFileActions.setFilePriority.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  file: API.QueueFile, 
  priority: API.QueuePriorityEnum
) {
  let that = this;
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/priority`, {
    priority
  })
    .then(that.completed.bind(that, file))
    .catch(that.failed.bind(that, file));
});

/*QueueFileActions.removeFile.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  item: API.QueueFile, 
  removeFinished: boolean
) {
  const that = this;
  return SocketService.post(`${QueueConstants.FILES_URL}/${item.id}/remove`, {
    remove_finished: removeFinished,
  })
    .then(QueueFileActions.removeFile.completed.bind(that, item))
    .catch(QueueFileActions.removeFile.failed.bind(that, item));
});*/

export default QueueFileActions as UI.RefluxActionListType<void>;
