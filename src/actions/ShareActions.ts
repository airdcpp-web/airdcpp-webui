'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


import ConfirmDialog from 'components/semantic/ConfirmDialog';
import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const ShareActions = Reflux.createActions([
  { 'refresh': { 
    asyncResult: true,
    displayName: 'Refresh all',
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.REFRESH,
  } },
  { 'refreshPaths': { 
    asyncResult: true,
    displayName: 'Refresh directory',
    access: AccessConstants.SETTINGS_EDIT, 
    icon: IconConstants.REFRESH,
  } }, 
  { 'refreshVirtual': { 
    asyncResult: true,
  } },
  { 'addExclude': { 
    asyncResult: true,
    children: [ 'saved' ], 
    displayName: 'Add path',
    access: AccessConstants.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
  } }, 
  { 'removeExclude': { 
    asyncResult: true,
    children: [ 'confirmed' ], 
    displayName: 'Remove path',
    access: AccessConstants.SETTINGS_EDIT, 
    icon: IconConstants.REMOVE,
  } }, 
]);

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

ShareActions.refreshVirtual.listen(function (this: UI.AsyncActionType<API.ShareProfile>, path: string) {
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

ShareActions.addExclude.listen(function (location: Location) {
  History.push(`${location.pathname}/browse`);
});

ShareActions.addExclude.saved.listen(function (path: string) {
  return SocketService.post(ShareConstants.EXCLUDES_ADD_URL, { path })
    .then(ShareActions.addExclude.completed)
    .catch(ShareActions.addExclude.failed);
});

ShareActions.addExclude.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to add directory', error);
});

ShareActions.removeExclude.listen(function (this: UI.ConfirmActionType<API.ShareProfile>, path: string) {
  const options = {
    title: this.displayName,
    content: `Are you sure that you want to remove the excluded path ${path}?`,
    icon: this.icon,
    approveCaption: 'Remove path',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, path));
});

ShareActions.removeExclude.confirmed.listen(function (this: UI.AsyncActionType<API.ShareProfile>, path: string) {
  const that = this;
  return SocketService.post(ShareConstants.EXCLUDES_REMOVE_URL, { path })
    .then(ShareActions.removeExclude.completed.bind(that, path))
    .catch(ShareActions.removeExclude.failed.bind(that, path));
});

export default ShareActions;
