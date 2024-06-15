import HashConstants from 'constants/HashConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import IconConstants from 'constants/IconConstants';

interface HashItemData extends API.HashStats {
  id: string;
}

type Filter = UI.ActionFilter<HashItemData>;
const hasFiles: Filter = ({ itemData }) => itemData.hash_files_left > 0;
const isPaused: Filter = ({ itemData }) =>
  itemData.pause_forced && itemData.hashers === 0;
const hasHashers: Filter = ({ itemData }) => itemData.hashers > 0;

export const HashStopAction = {
  id: 'stop',
  displayName: 'Stop',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.STOP,
  filter: hasFiles,
  handler: () => {
    return SocketService.post(HashConstants.STOP_URL);
  },
};

export const HashResumeAction = {
  id: 'resume',
  displayName: 'Resume',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.PLAY,
  filter: isPaused,
  handler: () => {
    return SocketService.post(HashConstants.RESUME_URL);
  },
};

export const HashPauseAction = {
  id: 'pause',
  displayName: 'Pause',
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.PAUSE,
  filter: hasHashers,
  handler: () => {
    return SocketService.post(HashConstants.PAUSE_URL);
  },
};

export const HashActions: UI.ActionListType<HashItemData> = {
  stop: HashStopAction,
  resume: HashResumeAction,
  pause: HashPauseAction,
};

export const HashActionModule = {
  moduleId: UI.Modules.HASH,
};
