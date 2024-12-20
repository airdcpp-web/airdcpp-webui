import ConnectivityConstants from 'constants/ConnectivityConstants';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleDetectConnection: UI.ActionHandler<void> = ({ socket }) => {
  return socket.post(ConnectivityConstants.DETECT_URL);
};

export const ConnectivityDetectAction = {
  id: 'detect',
  displayName: 'Detect now',
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.CONFIGURE,
  handler: handleDetectConnection,
};

export const ConnectivityActionModule = {
  moduleId: UI.Modules.SETTINGS,
};
