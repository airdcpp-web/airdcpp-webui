'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SystemConstants from 'constants/SystemConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as UI from 'types/ui';


const SystemActionConfig: UI.RefluxActionConfigList<void> = [
  { 'fetchAway': { asyncResult: true } },
  { 'setAway': { asyncResult: true } },
];

export const SystemActions = Reflux.createActions(SystemActionConfig);


SystemActions.fetchAway.listen(function (this: UI.AsyncActionType<void>) {
  SocketService.get(SystemConstants.MODULE_URL + '/away')
    .then(this.completed)
    .catch(this.failed);
});

SystemActions.setAway.listen(function (this: UI.AsyncActionType<void>, away: boolean) {
  SocketService.post(SystemConstants.MODULE_URL + '/away', { 
    away,
  })
    .then(this.completed.bind(this, away))
    .catch(this.failed);
});

SystemActions.setAway.completed.listen(function (away: boolean) {
  NotificationActions.info({ 
    title: away ? 'Away mode was enabled' : 'Away mode was disabled',
    uid: 'away',
  });
});

//export default {
//  moduleId: UI.Modules.COMMON,
//  subId: 'system',
//  actions: SystemActions,
//} as UI.ModuleActions<void>;

export default SystemActions as UI.RefluxActionListType<void>;
