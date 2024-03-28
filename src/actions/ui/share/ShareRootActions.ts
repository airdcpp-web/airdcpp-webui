import SocketService from 'services/SocketService';

import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleCreate: UI.ActionHandler<void> = ({ navigate }) => {
  navigate(`directories`);
};

const handleEdit: UI.ActionHandler<API.ShareRootEntry> = ({
  data: root,
  location,
  navigate,
}) => {
  navigate(`directories/${root.id}`);
};

const handleRemove: UI.ActionHandler<API.ShareRootEntry> = ({ data: root }) => {
  return SocketService.delete(ShareRootConstants.ROOTS_URL + '/' + root.id);
};

export const ShareRootCreateAction = {
  id: 'create',
  displayName: 'Add directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const ShareRootEditAction = {
  id: 'edit',
  displayName: 'Edit directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const ShareRootRemoveAction = {
  id: 'remove',
  displayName: 'Remove directory',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content:
      // eslint-disable-next-line max-len
      'Are you sure that you want to remove the directory {{item.virtual_name}} from share? It will be removed from all share profiles.',
    approveCaption: 'Remove directory',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const ShareRootEditActions: UI.ActionListType<API.ShareRootEntry> = {
  edit: ShareRootEditAction,
  remove: ShareRootRemoveAction,
};

export const ShareRootActionModule = {
  moduleId: UI.Modules.SHARE,
  subId: 'root',
};

export const ShareRootEditActionMenu = {
  moduleData: ShareRootActionModule,
  actions: ShareRootEditActions,
};
