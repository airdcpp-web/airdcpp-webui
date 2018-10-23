'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import FilelistSessionActions from 'actions/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';
import NotificationActions from 'actions/NotificationActions';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';


const notDefault = (item: API.ShareProfile) => !item.default;
const noData = (item: API.ShareProfile) => !item;

const ShareProfileActionConfig: UI.ActionConfigList<API.ShareProfile> = [
  { 'create': { 
    asyncResult: true,
    displayName: 'Add profile',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
    filter: noData,
    input: {
      approveCaption: 'Create',
      content: 'Enter name for the profile',
      inputProps: {
        placeholder: 'Enter name',
        required: true,
      }
    }
  } },
  { 'browse': { 
    asyncResult: true,
    displayName: 'Browse files',
    access: API.AccessEnum.FILELISTS_VIEW,
    icon: IconConstants.FILELIST,
  } },
  'divider',
  { 'edit': { 
    asyncResult: true,
    displayName: 'Rename profile',
    access: API.AccessEnum.SETTINGS_EDIT,  
    icon: IconConstants.EDIT,
    input: profile => ({
      approveCaption: 'Rename',
      content: `Enter new name for the profile ${profile.name}`,
      inputProps: {
        placeholder: 'Enter name',
        defaultValue: profile.name,
        required: true,
      }
    })
  } },
  { 'default': { 
    asyncResult: true,
    displayName: 'Set as default',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.DEFAULT,
    filter: notDefault,
  } },
  { 'remove': { 
    asyncResult: true,
    displayName: 'Remove profile',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
    filter: notDefault,
    confirmation: profile => ({
      content: `Are you sure that you want to remove the profile ${profile.name}?`,
      approveCaption: 'Remove profile',
      rejectCaption: `Don't remove`,
    })
  } },
];

const ShareProfileActions = Reflux.createActions(ShareProfileActionConfig);

ShareProfileActions.create.listen(function (data: any, location: any, name: string) {
  return SocketService.post(ShareProfileConstants.PROFILES_URL, { name: name })
    .then(ShareProfileActions.create.completed)
    .catch(ShareProfileActions.create.failed);
});

ShareProfileActions.default.listen(function (this: UI.AsyncActionType<API.ShareProfile>, profile: API.ShareProfile) {
  const that = this;
  return SocketService.post(`${ShareProfileConstants.PROFILES_URL}/${profile.id}/default`)
    .then(ShareProfileActions.default.completed.bind(that, profile))
    .catch(ShareProfileActions.default.failed.bind(that, profile));
});

ShareProfileActions.edit.listen(function (
  this: UI.AsyncActionType<API.ShareProfile>, 
  profile: API.ShareProfile, 
  location: any,
  name: string
) {
  const that = this;
  return SocketService.patch(`${ShareProfileConstants.PROFILES_URL}/${profile.id}`, { name: name })
    .then(ShareProfileActions.edit.completed.bind(that, profile))
    .catch(ShareProfileActions.edit.failed.bind(that, profile));
});

ShareProfileActions.edit.failed.listen(function (profile: API.ShareProfile, error: ErrorResponse) {
  NotificationActions.apiError('Failed to rename profile', error, profile.id);
});

ShareProfileActions.create.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create profile', error);
});

ShareProfileActions.remove.listen(function (
  this: UI.AsyncActionType<API.ShareProfile>, 
  profile: API.ShareProfile
) {
  const that = this;
  return SocketService.delete(ShareProfileConstants.PROFILES_URL + '/' + profile.id)
    .then(ShareProfileActions.remove.completed.bind(that, profile))
    .catch(ShareProfileActions.remove.failed.bind(that, profile));
});

ShareProfileActions.browse.listen(function (
  this: UI.AsyncActionType<API.ShareProfile>, 
  profile: API.ShareProfile, 
  location: Location
) {
  return FilelistSessionActions.ownList(location, profile.id, FilelistSessionStore);
});

export default ShareProfileActions;
