const MODULE_URL = 'histories/v0';

export const HistoryEnum = {
	SEARCH: 'search_pattern',
	EXCLUDE: 'search_excluded',
	DOWNLOAD_DIR: 'download_target'
};

export default {
	MODULE_URL: MODULE_URL,

	HUBS_URL: MODULE_URL + '/hubs',
	HUBS_SEARCH_URL: MODULE_URL + '/hubs/search',

	STRINGS_URL: MODULE_URL + '/strings',
	STRING_URL: MODULE_URL + '/string',
};
