//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import SessionConstants from 'constants/SessionConstants';

import * as UI from 'types/ui';

const ActivityActionConfig: UI.RefluxActionConfigList<any> = [
  { sessionActivity: { asyncResult: true } },
  'userActiveChanged',
];

const ActivityActions = Reflux.createActions(ActivityActionConfig);

ActivityActions.sessionActivity.listen(function (this: UI.AsyncActionType<any>) {
  const that = this;
  return SocketService.post(SessionConstants.ACTIVITY_URL, {
    user_active: true,
  })
    .then(that.completed)
    .catch(that.failed);
});

export default ActivityActions as UI.RefluxActionListType<void>;
