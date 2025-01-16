import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/reflux/FilelistSessionStore';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { MENU_DIVIDER } from 'constants/ActionConstants';
import ShareRootConstants from 'constants/ShareRootConstants';

type Filter = UI.ActionFilter<API.ShareProfile>;
const notDefault: Filter = ({ itemData: profile }) => !profile.default;

const handleCreate: UI.ActionHandler<void> = ({ socket }, name: string) => {
  return socket.post<API.ShareProfile>(ShareProfileConstants.PROFILES_URL, {
    name: name,
  });
};

type Handler = UI.ActionHandler<API.ShareProfile>;
const handleClone: Handler = async (data, name: string) => {
  // Create new profile
  const newProfile: API.ShareProfile = await handleCreate(
    data as unknown as UI.ActionHandlerData<void, void>,
    name,
  );

  const { itemData: sourceProfile, socket } = data;

  // Fetch roots
  const roots = await socket.get<API.ShareRootEntry[]>(
    `${ShareRootConstants.MODULE_URL}`,
  );

  // Add new profile in all roots that include the source profile
  for (const root of roots) {
    const rootProfileIds = root.profiles.map((rootProfile) => rootProfile.id);
    if (!rootProfileIds.includes(sourceProfile.id)) {
      continue;
    }

    await socket.patch(`${ShareRootConstants.MODULE_URL}/${root.id}`, {
      profiles: [...rootProfileIds, newProfile.id],
    });
  }
};

const handleDefault: Handler = ({ itemData: profile, socket }) => {
  return socket.post(`${ShareProfileConstants.PROFILES_URL}/${profile.id}/default`);
};

const handleEdit: Handler = ({ itemData: profile, socket }, name: string) => {
  return socket.patch(`${ShareProfileConstants.PROFILES_URL}/${profile.id}`, {
    name: name,
  });
};

const handleRemove: Handler = ({ itemData: profile, socket }) => {
  return socket.delete(ShareProfileConstants.PROFILES_URL + '/' + profile.id);
};

const handleBrowse: Handler = ({ itemData: profile, location, navigate }) => {
  return FilelistSessionActions.ownList(profile.id, {
    location,
    navigate,
    sessionStore: FilelistSessionStore,
  });
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

export const ShareProfileCloneAction = {
  id: 'clone',
  displayName: 'Clone profile',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.COPY,
  input: {
    approveCaption: 'Create',
    content: 'Enter name for the profile (cloned from {{item.name}})',
    inputProps: {
      placeholder: 'Enter name',
      required: true,
    },
  },
  handler: handleClone,
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
  filter: notDefault,
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
