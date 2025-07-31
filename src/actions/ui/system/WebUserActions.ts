import WebUserConstants from '@/constants/WebUserConstants';

import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

type Filter = UI.ActionFilter<API.WebUser>;

const initIsOther = (session: UI.AuthenticatedSession) => {
  const isOther: Filter = ({ itemData: user }) => user.id !== session.user.username;

  return isOther;
};

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

export const createWebUserRemoveAction = (session: UI.AuthenticatedSession) => ({
  id: 'remove',
  displayName: 'Remove user',
  filter: initIsOther(session),
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the user {{item.username}}?',
    approveCaption: 'Remove user',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
});

const createWebUserEditActions = (
  session: UI.AuthenticatedSession,
): UI.ActionListType<API.WebUser> => ({
  edit: WebUserEditAction,
  remove: createWebUserRemoveAction(session),
});

export const WebUserActionModule = {
  moduleId: UI.Modules.SETTINGS,
  subId: 'webUser',
};

export const createWebUserEditActionMenu = (session: UI.AuthenticatedSession) => ({
  moduleData: WebUserActionModule,
  actions: createWebUserEditActions(session),
});
