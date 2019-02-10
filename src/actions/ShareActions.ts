'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';


const ShareActionConfig: UI.ActionConfigList<void> = [
  { 'refresh': { 
    asyncResult: true,
    displayName: 'Refresh all',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REFRESH,
  } },
  { 'refreshPaths': { 
    asyncResult: true,
    displayName: 'Refresh directory',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REFRESH,
  } }, 
  { 'refreshVirtual': { 
    asyncResult: true,
  } }, 
];

const ShareActions = Reflux.createActions(ShareActionConfig);

ShareActions.refresh.listen(function (this: UI.AsyncActionType<void>, incoming: boolean) {
  const that = this;
  return SocketService.post(ShareConstants.REFRESH_URL)
    .then(that.completed)
    .catch(that.failed);
});

ShareActions.refreshPaths.listen(function (this: UI.AsyncActionType<void>, paths: string[]) {
  const that = this;
  return SocketService.post(ShareConstants.REFRESH_PATHS_URL, { paths: paths })
    .then(that.completed)
    .catch(that.failed);
});

ShareActions.refreshVirtual.listen(function (this: UI.AsyncActionType<void>, path: string) {
  const that = this;
  return SocketService.post(ShareConstants.REFRESH_VIRTUAL_URL, { 
    path,
  })
    .then(that.completed)
    .catch(that.failed);
});

ShareActions.refreshVirtual.failed.listen(function (error: ErrorResponse) {
  NotificationActions.error({ 
    title: 'Refresh failed',
    message: error.message,
  });
});


export default {
  id: UI.Modules.SHARE,
  actions: ShareActions,
};

