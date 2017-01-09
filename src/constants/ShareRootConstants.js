const MODULE_URL = 'share_roots/v0';

export const StateEnum = {
	NORMAL: 'normal',
	REFRESH_PENDING: 'refresh_pending',
	REFRESH_RUNNING: 'refresh_running'
};

export default {
	MODULE_URL: MODULE_URL,
	ROOTS_URL: MODULE_URL + '/roots',
	ROOT_URL: MODULE_URL + '/root',

	CREATED: 'share_root_created',
	UPDATED: 'share_root_updated',
	REMOVED: 'share_root_removed',
}
;
