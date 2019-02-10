'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const sendPassword = (
  hub: API.FavoriteHubEntry, 
  password: string | null, 
  action: UI.AsyncActionType<API.FavoriteHubEntry>
) => {
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, { password: password })
    .then(() => 
      action.completed(hub))
    .catch((error) => 
      action.failed(error, hub)
    );
};

const hasPassword = (entry: API.FavoriteHubEntry) => entry.has_password;
const noPassword = (entry: API.FavoriteHubEntry) => !hasPassword(entry);


const FavoriteHubPasswordActionConfig: UI.ActionConfigList<API.FavoriteHubEntry> = [
  { 'create': { 
    asyncResult: true, 
    children: [ 'saved' ], 
    displayName: 'Set password',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT, 
    icon: IconConstants.LOCK,
    filter: noPassword,
    input: hub => ({
      content: `Set password for the hub ${hub.name}`,
      approveCaption: 'Set password',
      inputProps: {
        placeholder: 'Enter password',
        type: 'password',
      }
    })
  } },
  { 'change': { 
    asyncResult: true, 
    children: [ 'saved' ], 
    displayName: 'Change password',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT, 
    icon: IconConstants.EDIT,
    filter: hasPassword,
    input: hub => ({
      content: `Enter new password for the hub ${hub.name}`,
      approveCaption: 'Update password',
      inputProps: {
        placeholder: 'Enter password',
        type: 'password',
      }
    }),
  } },
  { 'remove': { 
    asyncResult: true,
    displayName: 'Remove password',
    access: API.AccessEnum.FAVORITE_HUBS_EDIT,
    icon: IconConstants.REMOVE,
    filter: hasPassword,
    confirmation: hub => ({
      content: `Are you sure that you want to reset the password of the hub ${hub.name}?`,
      approveCaption: 'Remove password',
      rejectCaption: `Don't remove`,
    })
  } },
];

const FavoriteHubPasswordActions = Reflux.createActions(FavoriteHubPasswordActionConfig);

FavoriteHubPasswordActions.create.listen(function (hub: API.FavoriteHubEntry, location: any, password: string) {
  sendPassword(hub, password, FavoriteHubPasswordActions.create);
});

FavoriteHubPasswordActions.change.listen(function (hub: API.FavoriteHubEntry, location: any, password: string) {
  sendPassword(hub, password, FavoriteHubPasswordActions.change);
});

FavoriteHubPasswordActions.remove.listen(function (hub: API.FavoriteHubEntry) {
  sendPassword(hub, null, FavoriteHubPasswordActions.remove);
});

export default {
  id: UI.Modules.FAVORITE_HUBS,
  actions: FavoriteHubPasswordActions,
};
