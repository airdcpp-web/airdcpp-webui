const HUB_MODULE_URL = 'hubs/v0';
export default {
	HUB_MODULE_URL: HUB_MODULE_URL,
	HUB_SEARCH_NICKS_URL: HUB_MODULE_URL + '/search_nicks',
	HUB_STATS_URL: HUB_MODULE_URL + '/stats',

	MAX_HUB_MESSAGES: 100,

	HUB_SESSIONS_URL: HUB_MODULE_URL + '/sessions',
	HUB_SESSION_URL: HUB_MODULE_URL + '/session',

	HUB_SESSION_CREATED: 'hub_created',
	HUB_SESSION_REMOVED: 'hub_removed',
	HUB_SESSION_UPDATED: 'hub_updated',

	HUB_MESSAGE: 'hub_chat_message',
	HUB_STATUS_MESSAGE: 'hub_status_message',
};
