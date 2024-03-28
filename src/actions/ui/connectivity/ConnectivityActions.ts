import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import * as UI from 'types/ui';
import IconConstants from 'constants/IconConstants';

export const ConnectivityDetectAction = {
  id: 'detect',
  displayName: 'Detect now',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.CONFIGURE,
  handler: () => {
    return SocketService.post(ConnectivityConstants.DETECT_URL);
  },
};

const ConnectivityActions: UI.ActionListType<undefined> = {
  detect: ConnectivityDetectAction,
};

export default {
  moduleId: UI.Modules.SETTINGS,
  actions: ConnectivityActions,
};
