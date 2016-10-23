const MODULE_URL = 'share/v0';
export default {
	MODULE_URL: MODULE_URL,

	DUPE_PATHS_URL: MODULE_URL + '/find_dupe_paths',
	GROUPED_ROOTS_GET_URL: MODULE_URL + '/grouped_root_paths',
	STATS_URL: MODULE_URL + '/stats',

	REFRESH_URL: MODULE_URL + '/refresh',
	REFRESH_PATHS_URL: MODULE_URL + '/refresh/paths',
	REFRESH_VIRTUAL_URL: MODULE_URL + '/refresh/virtual',

	EXCLUDES_URL: MODULE_URL + '/excludes',
	EXCLUDE_ADD_URL: MODULE_URL + '/exclude/add',
	EXCLUDE_REMOVE_URL: MODULE_URL + '/exclude/remove',

	EXCLUDE_ADDED: 'exclude_added',
	EXCLUDE_REMOVED: 'exclude_removed',
}
;
