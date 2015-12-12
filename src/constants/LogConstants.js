const LOG_MODULE_URL = 'log/v0';

export const SeverityEnum = {
	INFO: 0,
	WARNING: 1,
	ERROR: 2,
};

export default {
	LOG_MODULE_URL: LOG_MODULE_URL,
	LOG_GET_URL: LOG_MODULE_URL + '/messages',
	LOG_CLEAR_URL: LOG_MODULE_URL + '/clear',
	LOG_READ_URL: LOG_MODULE_URL + '/read',

	LOG_MESSAGE: 'log_message',
	LOG_READ: 'log_read',
	LOG_CLEARED: 'log_cleared',
	MAX_LOG_MESSAGES: 50,
};