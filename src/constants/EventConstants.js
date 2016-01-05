const MODULE_URL = 'log/v0';

export const SeverityEnum = {
	NOTIFY: 'notify',
	INFO: 'info',
	WARNING: 'warning',
	ERROR: 'error',
};

export default {
	MODULE_URL: MODULE_URL,
	GET_URL: MODULE_URL + '/messages',
	CLEAR_URL: MODULE_URL + '/clear',
	READ_URL: MODULE_URL + '/read',
	INFO_URL: MODULE_URL + '/info',

	LOG_MESSAGE: 'log_message',
	LOG_INFO: 'log_info',
};