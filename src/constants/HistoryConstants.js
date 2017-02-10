const MODULE_URL = 'histories';

export const HistoryEnum = {
	SEARCH: 'search_pattern',
	EXCLUDE: 'search_excluded',
	DOWNLOAD_DIR: 'download_target'
};

export default {
	MODULE_URL: MODULE_URL,

	HUBS_URL: MODULE_URL + '/hubs',
	PRIVATE_CHATS_URL: MODULE_URL + '/private_chats',
	FILELISTS_URL: MODULE_URL + '/filelists',

	HUBS_SEARCH_URL: MODULE_URL + '/hubs/search',

	STRINGS_URL: MODULE_URL + '/strings',
};
