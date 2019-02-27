'use strict';
//@ts-ignore
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

//import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';


const setBundlePriorities = (prio: API.QueuePriorityEnum) => {
  return SocketService.post(QueueConstants.BUNDLES_URL + '/priority', { 
    priority: prio 
  });
};

const handlePause = () => {
  return setBundlePriorities(API.QueuePriorityEnum.PAUSED_FORCED);
};

const handleResume = () => {
  return setBundlePriorities(API.QueuePriorityEnum.DEFAULT);
};

const handleRemoveCompleted = () => {
  return SocketService.post(QueueConstants.BUNDLES_URL + '/remove_completed');
};

/*QueueActions.removeCompleted.completed.listen(function (data: { count: number }) {
  NotificationActions.success({ 
    title: 'Action completed',
    message: data.count > 0 ? `${data.count} completed bundles were removed` : 'No bundles were removed',
  });
});*/



const QueueActions: UI.ActionListType<null> = {
  removeCompleted: {
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Remove completed bundles', 
    icon: IconConstants.REMOVE,
    handler: handleRemoveCompleted,
  },
  divider: null,
  pause: {
    displayName: 'Pause all bundles',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.PAUSE,
    handler: handlePause,
  },
  resume: { 
    displayName: 'Resume all bundles',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.PLAY,
    handler: handleResume,
  }
};

export default {
  moduleId: UI.Modules.QUEUE,
  actions: QueueActions,
};

