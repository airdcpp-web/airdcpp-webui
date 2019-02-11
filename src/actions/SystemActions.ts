'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SystemConstants from 'constants/SystemConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';
import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';


const SystemActionConfig: UI.ActionConfigList<void> = [
  { 'fetchAway': { asyncResult: true } },
  { 'setAway': { asyncResult: true } },
  { 'restartWeb': { 
    asyncResult: true,
    displayName: 'Restart web server',
    access: API.AccessEnum.ADMIN,
    icon: IconConstants.REFRESH,
    confirmation: {
      content: `When changing the binding options, it's recommended to restart the web server only 
                when you are able to access the server for troubleshooting. If  \
                the web server won't come back online, you should start the application 
                manually to see if there are any error messages. The configuration file is location in your \
                user directory by default (inside .airdc++ directory) in case you need to edit it manually.`,
      approveCaption: 'Continue and restart',
      rejectCaption: `Don't restart`,
    }
  } },
  { 'shutdown': { 
    asyncResult: true,
    displayName: 'Shut down application',
    access: API.AccessEnum.ADMIN,
    icon: IconConstants.POWER,
    confirmation: {
      content: 'Are you sure that you wish to shut down the application?',
      approveCaption: 'Continue and shut down',
      rejectCaption: 'Cancel',
    }
  } },
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

SystemActions.restartWeb.listen(function (this: UI.AsyncActionType<void>) {
  let that = this;
  SocketService.post(SystemConstants.MODULE_URL + '/restart_web')
    .then(that.completed)
    .catch(that.failed);
});

SystemActions.shutdown.listen(function (this: UI.AsyncActionType<void>) {
  let that = this;
  SocketService.post(SystemConstants.MODULE_URL + '/shutdown')
    .then(that.completed)
    .catch(that.failed);
});

SystemActions.setAway.completed.listen(function (away: boolean) {
  NotificationActions.info({ 
    title: away ? 'Away mode was enabled' : 'Away mode was disabled',
    uid: 'away',
  });
});

export default {
  moduleId: UI.Modules.COMMON,
  subId: 'system',
  actions: SystemActions,
} as UI.ModuleActions<void>;
