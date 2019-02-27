'use strict';
//@ts-ignore
import Reflux from 'reflux';
import { default as QueueConstants } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


const QueueBundleActionConfig: UI.RefluxActionConfigList<API.QueueBundle> = [
  { 'setBundlePriority': { 
    asyncResult: true,
  } },
];

const QueueBundleActions = Reflux.createActions(QueueBundleActionConfig);


QueueBundleActions.setBundlePriority.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  bundle: API.QueueBundle, 
  priority: API.QueuePriorityEnum
) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/priority`, {
    priority
  })
    .then(that.completed)
    .catch(that.failed);
});


//export default {
//  moduleId: UI.Modules.QUEUE,
  //subId: 'bundle',
//  actions: QueueBundleActions,
//} as UI.ModuleActions<API.QueueBundle>;

export default QueueBundleActions as UI.RefluxActionListType<void>;
