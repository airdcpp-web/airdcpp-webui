'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


//const itemNotFinished = (item: API.QueueFile) => item.time_finished === 0;


const QueueFileActionConfig: UI.RefluxActionConfigList<API.QueueFile> = [
  { 'setFilePriority': { 
    asyncResult: true,
  } },
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

//export default {
//  moduleId: UI.Modules.QUEUE,
  //subId: 'file',
//  actions: QueueFileActions,
//} as UI.ModuleActions<API.QueueFile>;

export default QueueFileActions as UI.RefluxActionListType<void>;
