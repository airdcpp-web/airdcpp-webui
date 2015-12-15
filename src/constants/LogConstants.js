const LOG_MODULE_URL = 'log/v0';

export const SeverityEnum = {
	INFO: 'info',
	WARNING: 'warning',
	ERROR: 'error',
};

export default {
	LOG_MODULE_URL: LOG_MODULE_URL,
	LOG_GET_URL: LOG_MODULE_URL + '/messages',
	LOG_CLEAR_URL: LOG_MODULE_URL + '/clear',
	LOG_READ_URL: LOG_MODULE_URL + '/read',
	LOG_INFO_URL: LOG_MODULE_URL + '/info',

	LOG_MESSAGE: 'log_message',
	LOG_INFO: 'log_info',

	//LOG_READ: 'log_read',
	//LOG_CLEARED: 'log_cleared',
};