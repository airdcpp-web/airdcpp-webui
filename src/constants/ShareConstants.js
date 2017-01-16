const MODULE_URL = 'share';
export default {
	MODULE_URL: MODULE_URL,

	DUPE_PATHS_URL: MODULE_URL + '/find_dupe_paths',
	GROUPED_ROOTS_GET_URL: MODULE_URL + '/grouped_root_paths',
	STATS_URL: MODULE_URL + '/stats',

	REFRESH_URL: MODULE_URL + '/refresh',
	REFRESH_PATHS_URL: MODULE_URL + '/refresh/paths',
	REFRESH_VIRTUAL_URL: MODULE_URL + '/refresh/virtual',

	EXCLUDES_URL: MODULE_URL + '/excludes',
	EXCLUDES_ADD_URL: MODULE_URL + '/excludes/add',
	EXCLUDES_REMOVE_URL: MODULE_URL + '/excludes/remove',

	EXCLUDE_ADDED: 'share_exclude_added',
	EXCLUDE_REMOVED: 'share_exclude_removed',
}
;
