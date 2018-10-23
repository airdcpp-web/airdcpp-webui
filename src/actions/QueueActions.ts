'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';


const QueueActionConfig: UI.ActionConfigList<API.QueueSource> = [
  { 'removeCompleted': { 
    asyncResult: true,
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Remove completed bundles', 
    icon: IconConstants.REMOVE,
  } },
  'divider',
  { 'pause': { 
    asyncResult: true, 
    displayName: 'Pause all bundles',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.PAUSE,
  } },
  { 'resume': { 
    asyncResult: true, 
    displayName: 'Resume all bundles',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.PLAY,
  } },
  { 'removeSource': { 
    asyncResult: true,
  } },
];

export const QueueActions = Reflux.createActions(QueueActionConfig);


const setBundlePriorities = (prio: API.QueuePriorityEnum, action: UI.AsyncActionType<API.QueueBundle>) => {
  return SocketService.post(QueueConstants.BUNDLES_URL + '/priority', { priority: prio })
    .then(() => 
      action.completed())
    .catch((error) => 
      action.failed(error)
    );
};

QueueActions.pause.listen(function () {
  setBundlePriorities(API.QueuePriorityEnum.PAUSED_FORCED, QueueActions.pause);
});

QueueActions.resume.listen(function () {
  setBundlePriorities(API.QueuePriorityEnum.DEFAULT, QueueActions.pause);
});

QueueActions.removeCompleted.listen(function (this: UI.AsyncActionType<void>) {
  let that = this;
  return SocketService.post(QueueConstants.BUNDLES_URL + '/remove_completed')
    .then(that.completed)
    .catch(that.failed);
});

QueueActions.removeCompleted.completed.listen(function (data: { count: number }) {
  NotificationActions.success({ 
    title: 'Action completed',
    message: data.count > 0 ? `${data.count} completed bundles were removed` : 'No bundles were removed',
  });
});

QueueActions.removeSource.listen(function (
  this: UI.AsyncActionType<API.QueueSource>, 
  item: API.QueueSource
) {
  let that = this;
  const { user } = item;
  return SocketService.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`)
    .then(that.completed.bind(that, user))
    .catch(that.failed.bind(that, user));
});

QueueActions.removeSource.completed.listen(function (user: API.HintedUser, data: { count: number }) {
  NotificationActions.info({ 
    title: 'Source removed',
    message: `The user ${user.nicks} was removed from ${data.count} files`,
  });
});

export default QueueActions;
