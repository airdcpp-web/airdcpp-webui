import SocketService from 'services/SocketService';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleRefresh = () => {
  return SocketService.post(ShareConstants.REFRESH_URL);
};

export const ShareRefreshAction = {
  id: 'refresh',
  displayName: 'Refresh',
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
