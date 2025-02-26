import ShareConstants from '@/constants/ShareConstants';
import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

const handleRefresh: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(ShareConstants.REFRESH_URL);
};

export const ShareRefreshAction = {
  id: 'refreshAll',
  displayName: 'Refresh all',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.REFRESH_COLORED,
  handler: handleRefresh,
};

const ShareActions: UI.ActionListType<undefined> = {
  refresh: ShareRefreshAction,
};

export const ShareActionModule = {
  moduleId: UI.Modules.SHARE,
};

export const ShareActionMenu = {
  moduleData: ShareActionModule,
  actions: ShareActions,
};
