import WebUserConstants from 'constants/WebUserConstants';

import IconConstants from 'constants/IconConstants';

import LoginStore from 'stores/reflux/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

type Filter = UI.ActionFilter<API.WebUser>;
const isOther: Filter = ({ itemData: user }) => user.id !== LoginStore.user.id;

const handleCreate: UI.ActionHandler<void> = ({ navigate }) => {
  navigate(`users`);
};

type Handler = UI.ActionHandler<API.WebUser>;
const handleEdit: Handler = ({ itemData: user, navigate }) => {
  navigate(`users/${user.id}`);
};

const handleRemove: Handler = ({ itemData: user, socket }) => {
  return socket.delete(`${WebUserConstants.USERS_URL}/${user.id}`);
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
