'use strict';

import SocketService from 'services/SocketService';

import ShareConstants from 'constants/ShareConstants';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const handleRefresh = () => {
  return SocketService.post(ShareConstants.REFRESH_URL);
};

/*const handleRefreshPaths = (paths: string[]) => {
  return SocketService.post(ShareConstants.REFRESH_PATHS_URL, { 
    paths: paths 
  });
};*/

/*ShareActions.refreshVirtual.listen(function (this: UI.AsyncActionType<void>, path: string) {
  const that = this;
  return SocketService.post(ShareConstants.REFRESH_VIRTUAL_URL, { 
    path,
  })
    .then(that.completed)
    .catch(that.failed);
});

ShareActions.refreshVirtual.failed.listen(function (error: ErrorResponse) {
  NotificationActions.error({ 
    title: 'Refresh failed',
    message: error.message,
  });
});*/


const ShareActions: UI.ActionListType<undefined> = {
  refresh: {
    displayName: 'Refresh all',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REFRESH,
    handler: handleRefresh,
  },
  /*refreshPaths: {
    displayName: 'Refresh directory',
    access: API.AccessEnum.SETTINGS_EDIT, 
    icon: IconConstants.REFRESH,
    handler: handleRefreshPaths,
  },*/ 
  /*refreshVirtual: { 
    asyncResult: true,
  },*/ 
};

export default {
  moduleId: UI.Modules.SHARE,
  actions: ShareActions,
};

