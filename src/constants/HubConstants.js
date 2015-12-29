const HUB_MODULE_URL = 'hubs/v0';
export default {
	HUB_MODULE_URL: HUB_MODULE_URL,
	HUB_SEARCH_NICKS_URL: HUB_MODULE_URL + '/search_nicks',
	HUB_STATS_URL: HUB_MODULE_URL + '/stats',

	HUB_SESSIONS_URL: HUB_MODULE_URL + '/sessions',
	SESSION_URL: HUB_MODULE_URL + '/session',

	SESSION_CREATED: 'hub_created',
	SESSION_REMOVED: 'hub_removed',
	SESSION_UPDATED: 'hub_updated',

	HUB_MESSAGE: 'hub_message',
	HUB_STATUS_MESSAGE: 'hub_status',
};
