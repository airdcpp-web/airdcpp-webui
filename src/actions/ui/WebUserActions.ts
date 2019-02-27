'use strict';

import SocketService from 'services/SocketService';

import WebUserConstants from 'constants/WebUserConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


const isOther = (user: API.WebUser) => user.id !== LoginStore.user.id;
const noData = (data: any) => !data;


const handleCreate: UI.ActionHandler<void> = ({ location }) => {
  History.push(`${location.pathname}/users`);
};

const handleEdit: UI.ActionHandler<API.WebUser> = ({ data: user, location }) => {
  History.push(`${location.pathname}/users/${user.id}`);
};

const handleRemove: UI.ActionHandler<API.WebUser> = ({ data: user }) => {
  return SocketService.delete(`${WebUserConstants.USERS_URL}/${user.id}`);
};



const WebUserCreateActions: UI.ActionListType<undefined> = {
  create: { 
    displayName: 'Add user',
    icon: IconConstants.CREATE,
    filter: noData,
    handler: handleCreate
  },
};

const WebUserEditActions: UI.ActionListType<API.WebUser> = {
  edit: { 
    displayName: 'Edit user',
    icon: IconConstants.EDIT,
    handler: handleEdit,
  },
  remove: {
    displayName: 'Remove user', 
    filter: isOther,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the user {{item.username}}?',
      approveCaption: 'Remove user',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  },
};

export default {
  create: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'webUser',
    actions: WebUserCreateActions,
  },
  edit: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'webUser',
    actions: WebUserEditActions
  }
};
