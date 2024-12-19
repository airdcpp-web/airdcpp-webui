import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';

const handleDetectConnection: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(ConnectivityConstants.DETECT_URL);
};

export const ConnectivityDetectAction = {
  id: 'detect',
  displayName: 'Detect now',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.CONFIGURE,
  handler: handleDetectConnection,
};

export const ConnectivityActionModule = {
  moduleId: UI.Modules.SETTINGS,
};
