'use strict';
//@ts-ignore
import Reflux from 'reflux';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import i18next from 'i18next';


const QueueActionConfig: UI.RefluxActionConfigList<API.QueueSource> = [
  { 'removeSource': { 
    asyncResult: true,
  } },
];

export const QueueActions = Reflux.createActions(QueueActionConfig);


QueueActions.removeSource.listen(function (
  this: UI.AsyncActionType<API.QueueSource>, 
  item: API.QueueSource,
  t: i18next.TFunction
) {
  let that = this;
  const { user } = item;
  return SocketService.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`)
    .then(that.completed.bind(that, user, t))
    .catch(that.failed.bind(that, user));
});

QueueActions.removeSource.completed.listen(function (
  user: API.HintedUser, 
  t: i18next.TFunction, 
  data: { count: number }
) {
  NotificationActions.info({ 
    title: 'Source removed',
    message: `The user ${user.nicks} was removed from ${data.count} files`,
  });
});

export default QueueActions as UI.RefluxActionListType<void>;
