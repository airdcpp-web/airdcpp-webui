import SystemConstants from '@/constants/SystemConstants';

import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

const handleRestartWeb: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(SystemConstants.MODULE_URL + '/restart_web');
};

const handleShutdown: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(SystemConstants.MODULE_URL + '/shutdown');
};

export const SystemRestartWebAction = {
  id: 'restartWeb',
  displayName: 'Restart web server',
  access: API.AccessEnum.ADMIN,
  icon: IconConstants.REFRESH_COLORED,
  confirmation: {
    content: `When changing the binding options, it's recommended to restart the web server only 
                when you are able to access the server for troubleshooting. If  \
                the web server won't come back online, you should start the application 
                manually to see if there are any error messages. The configuration file is located in your \
                user directory by default (inside .airdc++ directory) in case you need to edit it manually.`,
    approveCaption: 'Continue and restart',
    rejectCaption: `Don't restart`,
  },
  handler: handleRestartWeb,
};

export const SystemShutdownAction = {
  id: 'shutdown',
  displayName: 'Shut down application',
  access: API.AccessEnum.ADMIN,
  icon: IconConstants.POWER,
  confirmation: {
    content: 'Are you sure that you wish to shut down the application?',
    approveCaption: 'Continue and shut down',
    rejectCaption: 'Cancel',
  },
  handler: handleShutdown,
};

export const SystemActionModule = {
  moduleId: UI.Modules.COMMON,
  subId: 'system',
};
