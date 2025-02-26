import QueueConstants from '@/constants/QueueConstants';

import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { MENU_DIVIDER } from '@/constants/ActionConstants';
import { APISocket } from '@/services/SocketService';

const setBundlePriorities = (socket: APISocket, prio: API.QueuePriorityEnum) => {
  return socket.post(QueueConstants.BUNDLES_URL + '/priority', {
    priority: prio,
  });
};

const handlePause: UI.ActionHandler<void> = ({ socket }) => {
  return setBundlePriorities(socket, API.QueuePriorityEnum.PAUSED_FORCED);
};

const handleResume: UI.ActionHandler<void> = ({ socket }) => {
  return setBundlePriorities(socket, API.QueuePriorityEnum.DEFAULT);
};

const handleRemoveCompleted: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(QueueConstants.BUNDLES_URL + '/remove_completed');
};

export const QueueRemoveCompletedAction = {
  id: 'removeCompleted',
  displayName: 'Remove completed bundles',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  handler: handleRemoveCompleted,
  notifications: {
    onSuccess: '{{result.count}} completed bundles were removed',
  },
};

export const QueuePauseAction = {
  id: 'pause',
  displayName: 'Pause all bundles',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.PAUSE,
  handler: handlePause,
};

export const QueueResumeAction = {
  id: 'resumeAll',
  displayName: 'Resume all bundles',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.PLAY,
  handler: handleResume,
};

const QueueActions: UI.ActionListType<void> = {
  removeCompleted: QueueRemoveCompletedAction,
  divider: MENU_DIVIDER,
  pause: QueuePauseAction,
  resume: QueueResumeAction,
};

export const QueueActionModule = {
  moduleId: UI.Modules.QUEUE,
};

export const QueueActionMenu = {
  moduleData: QueueActionModule,
  actions: QueueActions,
};
