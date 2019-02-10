'use strict';
//@ts-ignore
import Reflux from 'reflux';

import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import IconConstants from 'constants/IconConstants';
import NotificationActions from 'actions/NotificationActions';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Location } from 'history';
import { HubUserFlag } from 'types/api';


export type ActionUserType = (API.User & { nick?: string; }) | 
  (API.HintedUser & { nick?: string; }) | 
  (API.HubUser & { nicks?: string });

export interface ActionUserData {
  user: ActionUserType;
  directory?: string;
}

const checkFlags = ({ user }: ActionUserData) => {
  return (user.flags as HubUserFlag[]).indexOf('self') === -1 && (user.flags as HubUserFlag[]).indexOf('hidden') === -1;
};

const checkIgnore = ({ user }: ActionUserData) => {
  return (user.flags as HubUserFlag[]).indexOf('ignored') === -1 && checkFlags({ user });
};

const checkUnignore = ({ user }: ActionUserData) => {
  return (user.flags as HubUserFlag[]).indexOf('ignored') !== -1;
};

export const UserFileActions = [ 'message', 'browse' ];


const UserActionConfig: UI.ActionConfigList<ActionUserData> = [
  { 'message': { 
    asyncResult: true, 
    displayName: 'Send message', 
    access: API.AccessEnum.PRIVATE_CHAT_EDIT, 
    filter: checkFlags,
    icon: IconConstants.MESSAGE,
  } },
  { 'browse': { 
    asyncResult: true,	
    displayName: 'Browse share', 
    access: API.AccessEnum.FILELISTS_EDIT, 
    filter: checkFlags,
    icon: IconConstants.FILELIST,
  } },
  'divider',
  { 'ignore': { 
    asyncResult: true,	
    displayName: 'Ignore messages', 
    access: API.AccessEnum.SETTINGS_EDIT, 
    filter: checkIgnore,
    icon: 'red ban',
  } },
  { 'unignore': { 
    asyncResult: true,	
    displayName: 'Unignore messages', 
    access: API.AccessEnum.SETTINGS_EDIT, 
    filter: checkUnignore,
    icon: 'ban',
  } },
];

const UserActions = Reflux.createActions(UserActionConfig);


UserActions.message.listen(function (userData: ActionUserData, location: Location) {
  PrivateChatActions.actions.createSession(location, userData.user, PrivateChatSessionStore);
});

UserActions.browse.listen(function (userData: ActionUserData, location: Location) {
  FilelistSessionActions.actions.createSession(location, userData.user, FilelistSessionStore, userData.directory);
});

UserActions.ignore.listen(function (this: UI.AsyncActionType<API.User>, userData: ActionUserData, location: Location) {
  let that = this;
  return SocketService.post(UserConstants.IGNORES_URL + '/' + userData.user.cid)
    .then(that.completed.bind(that, userData))
    .catch(that.failed);
});

UserActions.unignore.listen(function (
  this: UI.AsyncActionType<API.User>, 
  userData: ActionUserData, 
  location: Location
) {
  let that = this;
  return SocketService.delete(`${UserConstants.IGNORES_URL}/${userData.user.cid}`)
    .then(that.completed.bind(that, userData))
    .catch(that.failed);
});

UserActions.ignore.completed.listen(function ({ user }: ActionUserData) {
  NotificationActions.info({ 
    title: user.nick ? user.nick : user.nicks,
    uid: user.cid,
    message: 'User was added in ignored users',
  });
});

UserActions.unignore.completed.listen(function ({ user }: ActionUserData) {
  NotificationActions.info({ 
    title: user.nick ? user.nick : user.nicks,
    uid: user.cid,
    message: 'User was removed from ignored users',
  });
});

export default {
  id: UI.Modules.COMMON,
  actions: UserActions,
};
