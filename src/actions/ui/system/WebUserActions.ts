import SocketService from 'services/SocketService';

import WebUserConstants from 'constants/WebUserConstants';

import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

const isOther = (user: API.WebUser) => user.id !== LoginStore.user.id;

const handleCreate: UI.ActionHandler<void> = ({ location, navigate }) => {
  navigate(`users`);
};

const handleEdit: UI.ActionHandler<API.WebUser> = ({ data: user, navigate }) => {
  navigate(`users/${user.id}`);
};

const handleRemove: UI.ActionHandler<API.WebUser> = ({ data: user }) => {
  return SocketService.delete(`${WebUserConstants.USERS_URL}/${user.id}`);
};

export const WebUserCreateAction = {
  id: 'create',
  displayName: 'Add user',
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const WebUserEditAction = {
  id: 'edit',
  displayName: 'Edit user',
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const WebUserRemoveAction = {
  id: 'remove',
  displayName: 'Remove user',
  filter: isOther,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the user {{item.username}}?',
    approveCaption: 'Remove user',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const WebUserEditActions: UI.ActionListType<API.WebUser> = {
  edit: WebUserEditAction,
  remove: WebUserRemoveAction,
};

export const WebUserActionModule = {
  moduleId: UI.Modules.SETTINGS,
  subId: 'webUser',
};

export const WebUserEditActionMenu = {
  moduleData: WebUserActionModule,
  actions: WebUserEditActions,
};
