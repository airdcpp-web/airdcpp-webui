'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import History from 'utils/History';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const ShareExcludeActionConfig: UI.ActionConfigList<string> = [
  { 'addExclude': { 
    asyncResult: true,
    children: [ 'saved' ], 
    displayName: 'Add path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
  } }, 
  { 'removeExclude': { 
    asyncResult: true,
    displayName: 'Remove path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REMOVE,
    confirmation: path => ({
      content: `Are you sure that you want to remove the excluded path ${path}?`,
      approveCaption: 'Remove path',
      rejectCaption: `Don't remove`,
    })
  } }, 
];

const ShareExcludeActions = Reflux.createActions(ShareExcludeActionConfig);


ShareExcludeActions.addExclude.listen(function (location: Location) {
  History.push(`${location.pathname}/browse`);
});

ShareExcludeActions.addExclude.saved.listen(function (path: string) {
  return SocketService.post(ShareConstants.EXCLUDES_ADD_URL, { path })
    .then(ShareExcludeActions.addExclude.completed)
    .catch(ShareExcludeActions.addExclude.failed);
});

ShareExcludeActions.addExclude.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to add directory', error);
});

ShareExcludeActions.removeExclude.listen(function (this: UI.AsyncActionType<API.ShareProfile>, path: string) {
  const that = this;
  return SocketService.post(ShareConstants.EXCLUDES_REMOVE_URL, { path })
    .then(ShareExcludeActions.removeExclude.completed.bind(that, path))
    .catch(ShareExcludeActions.removeExclude.failed.bind(that, path));
});

export default ShareExcludeActions;
