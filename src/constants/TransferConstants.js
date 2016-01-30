const MODULE_URL = 'transfers/v0';

export const StatusEnum = {
	WAITING: 'waiting',
	RUNNING: 'running',
	FAILED: 'failed',
	FINISHED: 'finished',
};

export default {
	MODULE_URL: MODULE_URL,
	STATS_URL: MODULE_URL + '/stats',

	FORCE_URL: MODULE_URL + '/force',
	DISCONNECT_URL: MODULE_URL + '/disconnect',

	STATISTICS: 'transfer_statistics'
};
