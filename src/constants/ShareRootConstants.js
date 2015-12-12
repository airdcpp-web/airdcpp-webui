const MODULE_URL = 'share_roots/v0';

export const RefreshStateEnum = {
	STATE_NORMAL: 0,
	STATE_PENDING: 1,
	STATE_RUNNING: 2
};

export default {
	MODULE_URL: MODULE_URL,
	ROOTS_URL: MODULE_URL + '/roots',
	ROOT_POST_URL: MODULE_URL + '/root/add',
	ROOT_UPDATE_URL: MODULE_URL + '/root/update',
	ROOT_DELETE_URL: MODULE_URL + '/root/remove',

	CREATED: 'share_root_created',
	UPDATED: 'share_root_updated',
	REMOVED: 'share_root_removed',
}
;
