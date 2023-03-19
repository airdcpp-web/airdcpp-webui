import SocketService from 'services/SocketService';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const notDefault = (item: API.ShareProfile) => !item.default;

const handleCreate: UI.ActionHandler<void> = (data, name: string) => {
  return SocketService.post(ShareProfileConstants.PROFILES_URL, { name: name });
};

const handleDefault: UI.ActionHandler<API.ShareProfile> = ({ data: profile }) => {
  return SocketService.post(
    `${ShareProfileConstants.PROFILES_URL}/${profile.id}/default`
  );
};

const handleEdit: UI.ActionHandler<API.ShareProfile> = (
  { data: profile },
  name: string
) => {
  return SocketService.patch(`${ShareProfileConstants.PROFILES_URL}/${profile.id}`, {
    name: name,
  });
};

const handleRemove: UI.ActionHandler<API.ShareProfile> = ({ data: profile }) => {
  return SocketService.delete(ShareProfileConstants.PROFILES_URL + '/' + profile.id);
};

const handleBrowse: UI.ActionHandler<API.ShareProfile> = ({
  data: profile,
  location,
}) => {
  return FilelistSessionActions.ownList(location, profile.id, FilelistSessionStore);
};

const ShareProfileCreateActions: UI.ActionListType<undefined> = {
  create: {
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
  },
};

const ShareProfileEditActions: UI.ActionListType<API.ShareProfile> = {
  browse: {
    displayName: 'Browse files',
    access: API.AccessEnum.FILELISTS_VIEW,
    icon: IconConstants.FILELIST,
    handler: handleBrowse,
  },
  divider: null,
  edit: {
    displayName: 'Rename profile',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.EDIT,
    input: (profile) => ({
      approveCaption: 'Rename',
      content: 'Enter new name for the profile {{item.name}}',
      inputProps: {
        placeholder: 'Enter name',
        defaultValue: profile.name,
        required: true,
      },
    }),
    handler: handleEdit,
  },
  default: {
    displayName: 'Set as default',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.DEFAULT,
    filter: notDefault,
    handler: handleDefault,
  },
  remove: {
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
  },
};

export default {
  create: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'profile',
    actions: ShareProfileCreateActions,
  },
  edit: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'profile',
    actions: ShareProfileEditActions,
  },
};
