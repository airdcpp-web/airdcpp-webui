'use strict';

import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import ConnectivityConstants from 'constants/ConnectivityConstants';

import * as UI from 'types/ui';


const ConnectivityActions: UI.ActionListType<{}> = {
  detect: { 
    //asyncResult: true,
    displayName: 'Detect now',
    access: AccessConstants.SETTINGS_EDIT,
    icon: 'gray configure',
    handler: () => {
      return SocketService.post(ConnectivityConstants.DETECT_URL);
    }
  }
};

export default {
  moduleId: UI.Modules.SETTINGS,
  actions: ConnectivityActions,
};
