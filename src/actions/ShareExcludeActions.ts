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
  { 'add': { 
    asyncResult: true,
    children: [ 'saved' ], 
    displayName: 'Add path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
  } }, 
  { 'remove': { 
    asyncResult: true,
    displayName: 'Remove path',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the excluded path {{item}}?',
      approveCaption: 'Remove path',
      rejectCaption: `Don't remove`,
    }
  } }, 
];

const ShareExcludeActions = Reflux.createActions(ShareExcludeActionConfig);


ShareExcludeActions.add.listen(function (itemData: any, location: Location) {
  History.push(`${location.pathname}/browse`);
});

ShareExcludeActions.add.saved.listen(function (path: string) {
  return SocketService.post(ShareConstants.EXCLUDES_ADD_URL, { path })
    .then(ShareExcludeActions.add.completed)
    .catch(ShareExcludeActions.add.failed);
});

ShareExcludeActions.add.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to add directory', error);
});

ShareExcludeActions.remove.listen(function (this: UI.AsyncActionType<string>, path: string) {
  const that = this;
  return SocketService.post(ShareConstants.EXCLUDES_REMOVE_URL, { path })
    .then(ShareExcludeActions.remove.completed.bind(that, path))
    .catch(ShareExcludeActions.remove.failed.bind(that, path));
});

export default {
  moduleId: UI.Modules.SETTINGS,
  subId: 'shareExclude',
  actions: ShareExcludeActions,
} as UI.ModuleActions<string>;
