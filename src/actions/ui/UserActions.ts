import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import IconConstants from 'constants/IconConstants';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { HubUserFlag } from 'types/api';

export type ActionUserType =
  | (API.User & { nick?: string; hub_url?: string })
  | (API.HintedUser & { nick?: string; id?: number })
  | (API.HubUser & { nicks?: string });

export interface ActionUserData {
  id: string | API.HintedUserBase;
  user: ActionUserType;
  directory?: string;
}

const checkFlags = ({ user }: ActionUserData) => {
  const flags = user.flags as HubUserFlag[];
  return !flags.includes('self') && !flags.includes('hidden');
};

const checkIgnore = (userData: ActionUserData) => {
  const flags = userData.user.flags as HubUserFlag[];
  return !flags.includes('ignored') && checkFlags(userData);
};

const checkUnignore = ({ user }: ActionUserData) => {
  const flags = user.flags as HubUserFlag[];
  return flags.includes('ignored');
};

const handleMessage: UI.ActionHandler<ActionUserData> = ({
  data: userData,
  location,
  history,
}) => {
  return PrivateChatActions.createSession(userData.user, {
    location,
    sessionStore: PrivateChatSessionStore,
    history,
  });
};

const handleBrowse: UI.ActionHandler<ActionUserData> = ({
  data: userData,
  location,
  history,
}) => {
  const createData = {
    user: userData.user,
    path: userData.directory,
  };

  return FilelistSessionActions.createSession(createData, {
    sessionStore: FilelistSessionStore,
    location,
    history,
  });
};

const handleIgnore: UI.ActionHandler<ActionUserData> = ({ data: userData }) => {
  return SocketService.post(UserConstants.IGNORES_URL + '/' + userData.user.cid);
};

const handleUnignore: UI.ActionHandler<ActionUserData> = ({ data: userData }) => {
  return SocketService.delete(`${UserConstants.IGNORES_URL}/${userData.user.cid}`);
};

export const UserFileActions = ['message', 'browse'];

const UserActions: UI.ActionListType<ActionUserData> = {
  message: {
    displayName: 'Send message',
    access: API.AccessEnum.PRIVATE_CHAT_EDIT,
    filter: checkFlags,
    icon: IconConstants.MESSAGE,
    handler: handleMessage,
  },
  browse: {
    displayName: 'Browse share',
    access: API.AccessEnum.FILELISTS_EDIT,
    filter: checkFlags,
    icon: IconConstants.FILELIST,
    handler: handleBrowse,
  },
  divider: null,
  ignore: {
    displayName: 'Ignore messages',
    access: API.AccessEnum.SETTINGS_EDIT,
    filter: checkIgnore,
    icon: IconConstants.IGNORE,
    handler: handleIgnore,
    notifications: {
      onSuccess: 'User {{item.nicks}} was added in ignored users',
    },
  },
  unignore: {
    displayName: 'Unignore messages',
    access: API.AccessEnum.SETTINGS_EDIT,
    filter: checkUnignore,
    icon: IconConstants.UNIGNORE,
    handler: handleUnignore,
    notifications: {
      onSuccess: 'User {{item.nicks}} was removed from ignored users',
    },
  },
};

export default {
  moduleId: UI.Modules.COMMON,
  subId: 'user',
  actions: UserActions,
};
