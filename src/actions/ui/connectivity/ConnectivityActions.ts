import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';

export const ConnectivityDetectAction = {
  id: 'detect',
  displayName: 'Detect now',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.CONFIGURE,
  handler: () => {
    return SocketService.post(ConnectivityConstants.DETECT_URL);
  },
};

export const ConnectivityActionModule = {
  moduleId: UI.Modules.SETTINGS,
};
