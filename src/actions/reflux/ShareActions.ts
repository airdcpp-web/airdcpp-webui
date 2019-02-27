'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';

import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';


const ShareActionConfig: UI.RefluxActionConfigList<void> = [
  { 'refresh': { 
    asyncResult: true,
  } },
  { 'refreshPaths': { 
    asyncResult: true
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


//export default {
//  moduleId: UI.Modules.SHARE,
//  actions: ShareActions,
//};

export default ShareActions as UI.RefluxActionListType<void>;
