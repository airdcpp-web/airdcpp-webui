import SocketService from 'services/SocketService';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

type Filter = UI.ActionFilter<API.ShareProfile>;
const notDefault: Filter = ({ itemData: profile }) => !profile.default;

const handleCreate: UI.ActionHandler<void> = (data, name: string) => {
  return SocketService.post(ShareProfileConstants.PROFILES_URL, { name: name });
};

type Handler = UI.ActionHandler<API.ShareProfile>;
const handleDefault: Handler = ({ itemData: profile }) => {
  return SocketService.post(
    `${ShareProfileConstants.PROFILES_URL}/${profile.id}/default`,
  );
};

const handleEdit: Handler = ({ itemData: profile }, name: string) => {
  return SocketService.patch(`${ShareProfileConstants.PROFILES_URL}/${profile.id}`, {
    name: name,
  });
};

const handleRemove: Handler = ({ itemData: profile }) => {
  return SocketService.delete(ShareProfileConstants.PROFILES_URL + '/' + profile.id);
};

const handleBrowse: Handler = ({ itemData: profile, location }) => {
  return FilelistSessionActions.ownList(location, profile.id, FilelistSessionStore);
};

export const ShareProfileCreateAction = {
  id: 'create',
  displayName: 'Add profile',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.CREATE,
  input: {
    approveCaption: 'Create',
    content: 'Enter name for the profile',
    inputProps: {
      placeholder: 'Enter name',
      required: true,
    },
  },
  handler: handleCreate,
};

export const ShareProfileBrowseAction = {
  id: 'browse',
  displayName: 'Browse files',
  access: API.AccessEnum.FILELISTS_VIEW,
  icon: IconConstants.FILELIST,
  handler: handleBrowse,
};

export const ShareProfileEditAction = {
  id: 'edit',
  displayName: 'Rename profile',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.EDIT,
  input: (profile: API.ShareProfile) => ({
    approveCaption: 'Rename',
    content: 'Enter new name for the profile {{item.name}}',
    inputProps: {
      placeholder: 'Enter name',
      defaultValue: profile.name,
      required: true,
    },
  }),
  handler: handleEdit,
};

export const ShareProfileSetDefaultAction = {
  id: 'default',
  displayName: 'Set as default',
  access: API.AccessEnum.SETTINGS_EDIT,
  filter: notDefault,
  icon: IconConstants.DEFAULT,
  handler: handleDefault,
};

export const ShareProfileRemoveAction = {
  id: 'remove',
  displayName: 'Remove profile',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the profile {{item.name}}?',
    approveCaption: 'Remove profile',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const ShareProfileEditActions: UI.ActionListType<API.ShareProfile> = {
  browse: ShareProfileBrowseAction,
  divider: MENU_DIVIDER,
  edit: ShareProfileEditAction,
  default: ShareProfileSetDefaultAction,
  remove: ShareProfileRemoveAction,
};

export const ShareProfileActionModule = {
  moduleId: UI.Modules.SETTINGS,
  subId: 'profile',
};

export const ShareProfileEditMenu = {
  moduleData: ShareProfileActionModule,
  actions: ShareProfileEditActions,
};
