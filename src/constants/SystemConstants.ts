const MODULE_URL = 'system';

export enum AwayEnum {
  OFF = 'off',
  IDLE = 'idle',
  MANUAL = 'manual',
}

export default {
  MODULE_URL: MODULE_URL,
  STATS_URL: MODULE_URL + '/stats',

  AWAY_STATE: 'away_state',
};
