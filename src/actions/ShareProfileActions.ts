'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import InputDialog from 'components/semantic/InputDialog';
import ConfirmDialog from 'components/semantic/ConfirmDialog';

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

const ShareProfileActions = Reflux.createActions([
  { 'create': { 
    asyncResult: true, 
    children: [ 'saved' ], 
    displayName: 'Add profile',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.CREATE,
    filter: noData,
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
    children: [ 'saved' ], 
    displayName: 'Rename profile',
    access: API.AccessEnum.SETTINGS_EDIT,  
    icon: IconConstants.EDIT,
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
    children: [ 'confirmed' ], 
    displayName: 'Remove profile', 
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REMOVE,
    filter: notDefault,
  } },
] as UI.ActionConfigList<API.ShareProfile>);

ShareProfileActions.create.listen(function (this: UI.EditorActionType<API.ShareProfile>) {
  const options = {
    icon: this.icon,
    approveCaption: 'Create',
    title: 'Create profile',
    text: 'Enter name for the profile',
  };

  const inputOptions = {
    placeholder: 'Enter name',
  };

  InputDialog(options, inputOptions, this.saved.bind(this));
});

ShareProfileActions.create.saved.listen(function (name: string) {
  return SocketService.post(ShareProfileConstants.PROFILES_URL, { name: name })
    .then(ShareProfileActions.create.completed)
    .catch(ShareProfileActions.create.failed);
});

ShareProfileActions.edit.listen(function (this: UI.EditorActionType<API.ShareProfile>, profile: API.ShareProfile) {
  const dialogOptions = {
    icon: this.icon,
    approveCaption: 'Rename',
    title: 'Rename profile',
    content: 'Enter new name for the profile ' + profile.name,
  };

  const inputOptions = {
    placeholder: 'Enter name',
    defaultValue: profile.name,
  };

  InputDialog(dialogOptions, inputOptions, this.saved.bind(this, profile));
});

ShareProfileActions.default.listen(function (this: UI.AsyncActionType<API.ShareProfile>, profile: API.ShareProfile) {
  const that = this;
  return SocketService.post(`${ShareProfileConstants.PROFILES_URL}/${profile.id}/default`)
    .then(ShareProfileActions.default.completed.bind(that, profile))
    .catch(ShareProfileActions.default.failed.bind(that, profile));
});

ShareProfileActions.edit.saved.listen(function (
  this: UI.AsyncActionType<API.ShareProfile>, 
  profile: API.ShareProfile, 
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

ShareProfileActions.remove.listen(function (this: UI.ConfirmActionType<API.ShareProfile>, profile: API.ShareProfile) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the profile ' + profile.name + '?',
    icon: this.icon,
    approveCaption: 'Remove profile',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, profile));
});

ShareProfileActions.remove.confirmed.listen(function (
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
