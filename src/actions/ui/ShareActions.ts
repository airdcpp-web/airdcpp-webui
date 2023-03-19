import SocketService from 'services/SocketService';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleRefresh = () => {
  return SocketService.post(ShareConstants.REFRESH_URL);
};

const ShareActions: UI.ActionListType<undefined> = {
  refresh: {
    displayName: 'Refresh all',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REFRESH_COLORED,
    handler: handleRefresh,
  },
};

export default {
  moduleId: UI.Modules.SHARE,
  actions: ShareActions,
};
