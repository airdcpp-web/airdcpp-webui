const MODULE_URL = 'system';

export const enum AwayEnum {
  OFF = 'off',
  IDLE = 'idle',
  MANUAL = 'manual',
}

export enum PlatformEnum {
  WINDOWS = 'win32',
  MAC = 'darwin',
  LINUX = 'linux',
  FREEBSD = 'freebsd',
  OTHER = 'other',
}

export default {
  MODULE_URL: MODULE_URL,
  STATS_URL: MODULE_URL + '/stats',

  AWAY_STATE: 'away_state',
};
