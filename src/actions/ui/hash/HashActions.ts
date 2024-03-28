import HashConstants from 'constants/HashConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import IconConstants from 'constants/IconConstants';

interface HashItemData extends API.HashStats {
  id: string;
}

export const HashStopAction = {
  id: 'stop',
  displayName: 'Stop',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.STOP,
  filter: (data: HashItemData) => data.hash_files_left > 0,
  handler: () => {
    return SocketService.post(HashConstants.STOP_URL);
  },
};

export const HashResumeAction = {
  id: 'resume',
  displayName: 'Resume',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.PLAY,
  filter: (data: HashItemData) => data.pause_forced && data.hashers === 0,
  handler: () => {
    return SocketService.post(HashConstants.RESUME_URL);
  },
};

export const HashPauseAction = {
  id_: 'pause',
  displayName: 'Pause',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.PAUSE,
  filter: (data: HashItemData) => data.hashers > 0,
  handler: () => {
    return SocketService.post(HashConstants.PAUSE_URL);
  },
};

export const HashActions: UI.ActionListType<HashItemData> = {
  stop: HashStopAction,
  resume: HashResumeAction,
  pause: HashPauseAction,
};

export default {
  moduleId: UI.Modules.HASH,
  actions: HashActions,
};
