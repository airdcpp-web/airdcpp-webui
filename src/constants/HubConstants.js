const MODULE_URL = 'hubs/v0';
export default {
	MODULE_URL: MODULE_URL,
	HUB_SEARCH_NICKS_URL: MODULE_URL + '/search_nicks',
	HUB_STATS_URL: MODULE_URL + '/stats',

	//HUB_SESSIONS_URL: MODULE_URL + '/sessions',
	SESSION_URL: MODULE_URL + '/session',

	SESSION_CREATED: 'hub_created',
	SESSION_REMOVED: 'hub_removed',
	SESSION_UPDATED: 'hub_updated',
	SESSION_COUNTS_UPDATED: 'hub_counts_updated',

	HUB_MESSAGE: 'hub_message',
	HUB_STATUS_MESSAGE: 'hub_status',
};
