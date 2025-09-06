const MODULE_URL = 'transfers';

export const StatusEnum = {
  WAITING: 'waiting',
  RUNNING: 'running',
  FAILED: 'failed',
  FINISHED: 'finished',
};

export default {
  MODULE_URL: MODULE_URL,
  TRANSFERS_URL: MODULE_URL,

  TRANSFERRED_BYTES_URL: MODULE_URL + '/transferred_bytes',
  STATISTICS_URL: MODULE_URL + '/stats',

  STATISTICS: 'transfer_statistics',

  VIEW_ID: 'transfer',
};
