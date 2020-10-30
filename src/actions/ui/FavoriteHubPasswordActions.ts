
import SocketService from 'services/SocketService';

import FavoriteHubConstants from 'constants/FavoriteHubConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const sendPassword = (
  hub: API.FavoriteHubEntry,
  password: string | null
) => {
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, { 
    password 
  });
};


const handleSetPassword: UI.ActionHandler<API.FavoriteHubEntry> = (
  { data: hub },
  password: string
) => {
  return sendPassword(hub, password);
};

const handleRemovePassword: UI.ActionHandler<API.FavoriteHubEntry> = ({ data: hub }) => {
  return sendPassword(hub, null);
};

const hasPassword = (data: API.FavoriteHubEntry) => data.has_password;
const noPassword = (data: API.FavoriteHubEntry) => !hasPassword(data);


const FavoriteHubPasswordActions: UI.ActionListType<API.FavoriteHubEntry> = {
  create: {
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
      }
    },
    handler: handleSetPassword,
  },
  change: {
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
      }
    },
    handler: handleSetPassword,
  },
  remove: {
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
  },
};

export default {
  moduleId: UI.Modules.FAVORITE_HUBS,
  subId: 'password',
  actions: FavoriteHubPasswordActions,
};
