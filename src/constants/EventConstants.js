const MODULE_URL = 'events';

export const SeverityEnum = {
	NOTIFY: 'notify',
	INFO: 'info',
	WARNING: 'warning',
	ERROR: 'error',
};

export default {
	MODULE_URL: MODULE_URL,
	MESSAGES_URL: MODULE_URL,
	
	READ_URL: MODULE_URL + '/read',
	INFO_URL: MODULE_URL + '/counts',

	MESSAGE: 'event_message',
	COUNTS: 'event_counts',
};