'use strict';
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import { PriorityEnum } from 'constants/PriorityConstants';

import NotificationActions from 'actions/NotificationActions';


export const QueueActions = Reflux.createActions([
  { 'removeCompleted': { 
    asyncResult: true,
    access: AccessConstants.QUEUE_EDIT, 
    displayName: 'Remove completed bundles', 
    icon: IconConstants.REMOVE,
  } },
  'divider',
  { 'pause': { 
    asyncResult: true, 
    displayName: 'Pause all bundles',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.PAUSE,
  } },
  { 'resume': { 
    asyncResult: true, 
    displayName: 'Resume all bundles',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.PLAY,
  } },
  { 'removeSource': { 
    asyncResult: true,
  } },
]);

const setBundlePriorities = (prio, action) => {
  return SocketService.post(QueueConstants.BUNDLES_URL + '/priority', { priority: prio })
    .then(() => 
      action.completed())
    .catch((error) => 
      action.failed(error)
    );
};

QueueActions.pause.listen(function () {
  setBundlePriorities(PriorityEnum.PAUSED_FORCED, QueueActions.pause);
});

QueueActions.resume.listen(function () {
  setBundlePriorities(PriorityEnum.DEFAULT, QueueActions.pause);
});

QueueActions.removeCompleted.listen(function () {
  let that = this;
  return SocketService.post(QueueConstants.BUNDLES_URL + '/remove_completed')
    .then(that.completed)
    .catch(that.failed);
});

QueueActions.removeCompleted.completed.listen(function (data) {
  NotificationActions.success({ 
    title: 'Action completed',
    message: data.count > 0 ? data.count + ' completed bundles were removed' : 'No bundles were removed',
  });
});

QueueActions.removeSource.listen(function (item) {
  let that = this;
  const { user } = item;
  return SocketService.delete(QueueConstants.SOURCES_URL + '/' + user.cid)
    .then(that.completed.bind(that, user))
    .catch(that.failed.bind(that, user));
});

QueueActions.removeSource.completed.listen(function (user, data) {
  NotificationActions.info({ 
    title: 'Source removed',
    message: 'The user ' + user.nicks + ' was removed from ' + data.count + ' files',
  });
});

export default QueueActions;
