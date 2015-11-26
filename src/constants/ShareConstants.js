const SHARE_MODULE_URL = 'share/v0';
export default {
	SHARE_MODULE_URL: SHARE_MODULE_URL,
	SHARE_PROFILES_URL: SHARE_MODULE_URL + '/profiles',
	SHARE_PROFILE_URL: SHARE_MODULE_URL + '/profile',

	SHARE_ROOTS_URL: SHARE_MODULE_URL + '/roots',
	SHARE_ROOT_POST_URL: SHARE_MODULE_URL + '/root/add',
	SHARE_ROOT_UPDATE_URL: SHARE_MODULE_URL + '/root/update',
	SHARE_ROOT_DELETE_URL: SHARE_MODULE_URL + '/root/remove',

	SHARE_DUPE_PATHS_URL: SHARE_MODULE_URL + '/find_dupe_paths',
	GROUPED_ROOTS_GET_URL: SHARE_MODULE_URL + '/grouped_root_paths',
	SHARE_STATS_URL: SHARE_MODULE_URL + '/stats',

	SHARE_PROFILE_ADDED: 'share_profile_added',
	SHARE_PROFILE_UPDATED: 'share_profile_updated',
	SHARE_PROFILE_REMOVED: 'share_profile_removed',

	SHARE_ROOT_CREATED: 'share_root_created',
	SHARE_ROOT_UPDATED: 'share_root_updated',
	SHARE_ROOT_REMOVED: 'share_root_removed',
	
	HIDDEN_PROFILE_ID: 1
}
;
