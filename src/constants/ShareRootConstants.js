const SHARE_ROOT_MODULE_URL = 'share_roots/v0';
export default {
	SHARE_ROOT_MODULE_URL: SHARE_ROOT_MODULE_URL,
	SHARE_ROOTS_URL: SHARE_ROOT_MODULE_URL + '/roots',
	SHARE_ROOT_POST_URL: SHARE_ROOT_MODULE_URL + '/root/add',
	SHARE_ROOT_UPDATE_URL: SHARE_ROOT_MODULE_URL + '/root/update',
	SHARE_ROOT_DELETE_URL: SHARE_ROOT_MODULE_URL + '/root/remove',

	SHARE_ROOT_CREATED: 'share_root_created',
	SHARE_ROOT_UPDATED: 'share_root_updated',
	SHARE_ROOT_REMOVED: 'share_root_removed',

	RefreshStateEnum: {
		STATE_NORMAL: 0,
		STATE_PENDING: 1,
		STATE_RUNNING: 2
	},
}
;
