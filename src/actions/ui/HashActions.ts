'use strict';
import HashConstants from 'constants/HashConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import IconConstants from 'constants/IconConstants';


interface ItemData extends API.HashStats {
  id: string;
}

export const HashActions: UI.ActionListType<ItemData> = {
  stop: {
    displayName: 'Stop',
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.STOP, 
    filter: data => data.hash_files_left > 0, 
    handler: () => {
      return SocketService.post(HashConstants.STOP_URL);
    }
  },
  resume: {
    displayName: 'Resume',
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.PLAY, 
    filter: data => data.pause_forced && data.hashers === 0, 
    handler: () => {
      return SocketService.post(HashConstants.RESUME_URL);
    }
  },
  pause: {
    displayName: 'Pause',
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.PAUSE,
    filter: data => data.hashers > 0, 
    handler: () => {
      return SocketService.post(HashConstants.PAUSE_URL);
    }
  }
};


export default {
  moduleId: UI.Modules.HASH,
  actions: HashActions,
};
