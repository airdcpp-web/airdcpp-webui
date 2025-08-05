import ShareConstants from '@/constants/ShareConstants';
import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

const handleAdd: UI.ActionHandler<void> = ({ navigate }) => {
  navigate(`browse`);
};

const handleRemove: UI.ActionHandler<string> = ({ itemData: path, socket }) => {
  return socket.post(ShareConstants.EXCLUDES_REMOVE_URL, { path });
};

export const ShareExcludeAddAction = {
  id: 'add',
  displayName: 'Add path',
  access: API.AccessEnum.SHARE_EDIT,
  icon: IconConstants.CREATE,
  handler: handleAdd,
};

export const ShareExcludeRemoveAction = {
  id: 'remove',
  displayName: 'Remove path',
  access: API.AccessEnum.SHARE_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the excluded path {{item}}?',
    approveCaption: 'Remove path',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const ShareExcludeEditActions: UI.ActionListType<string> = {
  remove: ShareExcludeRemoveAction,
};

export const ShareExcludeActionModule = {
  moduleId: UI.Modules.SETTINGS,
  subId: 'shareExclude',
};

export const ShareExcludeEditMenu = {
  moduleData: ShareExcludeActionModule,
  actions: ShareExcludeEditActions,
};
