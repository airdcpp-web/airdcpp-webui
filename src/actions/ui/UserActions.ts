'use strict';

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
  (API.User & { nick?: string; hub_url?: string; }) | 
  (API.HintedUser & { nick?: string; id?: number; }) | 
  (API.HubUser & { nicks?: string; });

export interface ActionUserData {
  id: string | API.HintedUserBase;
  user: ActionUserType;
  directory?: string;
}

const checkFlags = ({ user }: ActionUserData) => {
  return (user.flags as HubUserFlag[]).indexOf('self') === -1 && 
    (user.flags as HubUserFlag[]).indexOf('hidden') === -1;
};

const checkIgnore = (userData: ActionUserData) => {
  return (userData.user.flags as HubUserFlag[]).indexOf('ignored') === -1 && checkFlags(userData);
};

const checkUnignore = ({ user }: ActionUserData) => {
  return (user.flags as HubUserFlag[]).indexOf('ignored') !== -1;
};


const handleMessage: UI.ActionHandler<ActionUserData> = ({ data: userData, location }) => {
  return PrivateChatActions.createSession(location, userData.user, PrivateChatSessionStore);
};

const handleBrowse: UI.ActionHandler<ActionUserData> = ({ data: userData, location }) => {
  return FilelistSessionActions.createSession(location, userData.user, FilelistSessionStore, userData.directory);
};

const handleIgnore: UI.ActionHandler<ActionUserData> = ({ data: userData }) => {
  return SocketService.post(UserConstants.IGNORES_URL + '/' + userData.user.cid);
};

const handleUnignore: UI.ActionHandler<ActionUserData> = (
  { data: userData }
) => {
  return SocketService.delete(`${UserConstants.IGNORES_URL}/${userData.user.cid}`);
};


export const UserFileActions = [ 'message', 'browse' ];

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
    }
  },
  unignore: {
    displayName: 'Unignore messages', 
    access: API.AccessEnum.SETTINGS_EDIT, 
    filter: checkUnignore,
    icon: IconConstants.UNIGNORE,
    handler: handleUnignore,
    notifications: {
      onSuccess: 'User {{item.nicks}} was removed from ignored users',
    }
  },
};

export default {
  moduleId: UI.Modules.COMMON,
  subId: 'user',
  actions: UserActions,
};
