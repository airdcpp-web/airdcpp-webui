import IconConstants from '@/constants/IconConstants';

import UserConstants from '@/constants/UserConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { HubUserFlag } from '@/types/api';
import { MENU_DIVIDER } from '@/constants/ActionConstants';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';

export interface ActionUserData {
  id: string | API.HintedUserBase;
  user: UI.ActionUserType;
  directory?: string;
}

type Filter = UI.ActionFilter<ActionUserData>;
const checkFlags: Filter = ({ itemData: { user } }) => {
  const flags = user.flags as HubUserFlag[];
  return !flags.includes('self') && !flags.includes('hidden');
};

const checkIgnore: Filter = (data) => {
  const flags = data.itemData.user.flags as HubUserFlag[];
  return !flags.includes('ignored') && checkFlags(data);
};

const checkUnignore: Filter = ({ itemData: { user } }) => {
  const flags = user.flags as HubUserFlag[];
  return flags.includes('ignored');
};

type Handler = UI.ActionHandler<ActionUserData, UI.ActionMenuItemDataValueType>;

const handleMessage: Handler = ({ itemData: userData, ...other }) => {
  return PrivateChatAPIActions.createSession(userData.user, other);
};

const handleBrowse: Handler = ({ itemData: userData, ...other }) => {
  const createData = {
    user: userData.user,
    path: userData.directory,
  };

  return FilelistAPIActions.createRemoteSession(createData, other);
};

const handleIgnore: Handler = ({ itemData: userData, socket }) => {
  return socket.post(`${UserConstants.IGNORES_URL}/${userData.user.cid}`);
};

const handleUnignore: UI.ActionHandler<ActionUserData> = ({
  itemData: userData,
  socket,
}) => {
  return socket.delete(`${UserConstants.IGNORES_URL}/${userData.user.cid}`);
};

const createGrantHandler = (duration: number) => {
  const grantHandler: UI.ActionHandler<ActionUserData> = ({
    itemData: userData,
    socket,
  }) => {
    return socket.post(`${UserConstants.MODULE_URL}/slots/${userData.user.cid}`, {
      hub_url: userData.user.hub_url,
      duration,
    });
  };

  return grantHandler;
};

const NicksUnifier = (itemData: ActionUserData) => {
  const nicks = itemData.user.nicks || itemData.user.nick;
  return {
    nicks,
  };
};

export const UserFileActions = ['message', 'browse'];

export const UserMessageAction = {
  id: 'message',
  displayName: 'Send message',
  access: API.AccessEnum.PRIVATE_CHAT_EDIT,
  filter: checkFlags,
  icon: IconConstants.MESSAGE,
  handler: handleMessage,
};

export const UserBrowseAction = {
  id: 'browse',
  displayName: 'Browse share',
  access: API.AccessEnum.FILELISTS_EDIT,
  filter: checkFlags,
  icon: IconConstants.FILELIST,
  handler: handleBrowse,
};

export const UserIgnoreAction = {
  id: 'ignore',
  displayName: 'Ignore messages',
  access: API.AccessEnum.SETTINGS_EDIT,
  filter: checkIgnore,
  icon: IconConstants.IGNORE,
  handler: handleIgnore,
  notifications: {
    onSuccess: 'User {{item.nicks}} was added in ignored users',
    itemConverter: NicksUnifier,
  },
};

export const UserUnignoreAction = {
  id: 'unignore',
  displayName: 'Unignore messages',
  access: API.AccessEnum.SETTINGS_EDIT,
  filter: checkUnignore,
  icon: IconConstants.UNIGNORE,
  handler: handleUnignore,
  notifications: {
    onSuccess: 'User {{item.nicks}} was removed from ignored users',
    itemConverter: NicksUnifier,
  },
};

const CommonGrantAction = {
  icon: 'clock outline',
  access: API.AccessEnum.SETTINGS_EDIT,
  filter: checkFlags,

  notifications: {
    onSuccess: 'Granted slot for user {{item.nicks}}',
    itemConverter: NicksUnifier,
  },
};

export const UserGrantMinutesAction = {
  id: 'grantMinutes',
  displayName: 'Grant extra slot (10 min)',
  handler: createGrantHandler(10 * 60),
  ...CommonGrantAction,
};

export const UserGrantHourAction = {
  id: 'grantHour',
  displayName: 'Grant extra slot (hour)',
  handler: createGrantHandler(3600),
  ...CommonGrantAction,
};

export const UserGrantDayAction = {
  id: 'grantDay',
  displayName: 'Grant extra slot (day)',
  handler: createGrantHandler(24 * 3600),
  ...CommonGrantAction,
};

export const UserGrantWeekAction = {
  id: 'grantWeek',
  displayName: 'Grant extra slot (week)',
  handler: createGrantHandler(7 * 24 * 3600),
  ...CommonGrantAction,
};

const UserActions: UI.ActionListType<ActionUserData> = {
  message: UserMessageAction,
  browse: UserBrowseAction,
  divider: MENU_DIVIDER,
  ignore: UserIgnoreAction,
  unignore: UserUnignoreAction,
  grant: {
    id: 'slots',
    displayName: 'Extra slots',
    icon: IconConstants.UPLOAD,
    children: {
      grant10: UserGrantMinutesAction,
      grantHour: UserGrantHourAction,
      grantDay: UserGrantDayAction,
      grantWeek: UserGrantWeekAction,
    },
  },
};

export const UserActionModule = {
  moduleId: UI.Modules.COMMON,
  subId: 'user',
};

export const UserActionMenu = {
  moduleData: UserActionModule,
  actions: UserActions,
};
