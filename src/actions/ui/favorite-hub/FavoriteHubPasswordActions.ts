import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';
import { APISocket } from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';

const sendPassword = (
  socket: APISocket,
  hub: API.FavoriteHubEntry,
  password: string | null,
) => {
  return socket.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, {
    password,
  });
};

const handleSetPassword: UI.ActionHandler<API.FavoriteHubEntry> = (
  { itemData: hub, socket },
  password: string,
) => {
  return sendPassword(socket, hub, password);
};

const handleRemovePassword: UI.ActionHandler<API.FavoriteHubEntry> = ({
  itemData: hub,
  socket,
}) => {
  return sendPassword(socket, hub, null);
};

type Filter = UI.ActionFilter<API.FavoriteHubEntry>;
const hasPassword: Filter = ({ itemData: data }) => data.has_password;
const noPassword: Filter = (data) => !hasPassword(data);

const FavoriteHubPasswordCreateAction = {
  id: 'create',
  displayName: 'Set password',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.LOCK,
  filter: noPassword,
  input: {
    content: 'Set password for the hub {{item.name}}',
    approveCaption: 'Set password',
    inputProps: {
      placeholder: 'Enter password',
      type: 'password',
    },
  },
  handler: handleSetPassword,
};

const FavoriteHubPasswordChangeAction = {
  id: 'change',
  displayName: 'Change password',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.EDIT,
  filter: hasPassword,
  input: {
    content: 'Enter new password for the hub {{item.name}}',
    approveCaption: 'Update password',
    inputProps: {
      placeholder: 'Enter password',
      type: 'password',
    },
  },
  handler: handleSetPassword,
};

const FavoriteHubPasswordRemoveAction = {
  id: 'remove',
  displayName: 'Remove password',
  access: API.AccessEnum.FAVORITE_HUBS_EDIT,
  icon: IconConstants.REMOVE,
  filter: hasPassword,
  confirmation: {
    content: 'Are you sure that you want to reset the password of the hub {{item.name}}?',
    approveCaption: 'Remove password',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemovePassword,
};

const FavoriteHubPasswordActions: UI.ActionListType<API.FavoriteHubEntry> = {
  create: FavoriteHubPasswordCreateAction,
  change: FavoriteHubPasswordChangeAction,
  remove: FavoriteHubPasswordRemoveAction,
};

export const FavoriteHubPasswordActionModule = {
  moduleId: UI.Modules.FAVORITE_HUBS,
  subId: 'password',
};

export const FavoriteHubPasswordActionMenu = {
  moduleData: FavoriteHubPasswordActionModule,
  actions: FavoriteHubPasswordActions,
};
