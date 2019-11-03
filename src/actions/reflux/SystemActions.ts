'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SystemConstants from 'constants/SystemConstants';
import SocketService from 'services/SocketService';

import NotificationActions from 'actions/NotificationActions';

import * as UI from 'types/ui';
import { TFunction } from 'i18next';
import { translate } from 'utils/TranslationUtils';


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

SystemActions.setAway.listen(function (this: UI.AsyncActionType<void>, away: boolean, t: TFunction) {
  SocketService.post(SystemConstants.MODULE_URL + '/away', { 
    away,
  })
    .then(this.completed.bind(this, away, t))
    .catch(this.failed);
});

SystemActions.setAway.completed.listen(function (away: boolean, t: TFunction) {
  NotificationActions.info({ 
    title: translate(away ? 'Away mode was enabled' : 'Away mode was disabled', t, UI.Modules.COMMON),
    //uid: 'away',
  });
});

export default SystemActions as UI.RefluxActionListType<void>;
