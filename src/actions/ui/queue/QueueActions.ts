import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

const setBundlePriorities = (prio: API.QueuePriorityEnum) => {
  return SocketService.post(QueueConstants.BUNDLES_URL + '/priority', {
    priority: prio,
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

const QueueActions: UI.ActionListType<null> = {
  removeCompleted: QueueRemoveCompletedAction,
  divider: MENU_DIVIDER,
  pause: QueuePauseAction,
  resume: QueueResumeAction,
};

export default {
  moduleId: UI.Modules.QUEUE,
  actions: QueueActions,
};
