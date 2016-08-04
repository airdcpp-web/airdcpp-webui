const MODULE_URL = 'queue/v0';

export const StatusEnum = {
	QUEUED: 'queued',
	DOWNLOAD_FAILED: 'download_failed',
	RECHECK: 'recheck',
	DOWNLOADED: 'downloaded', // no queued files
	MOVED: 'moved', // all files moved
	FAILED_MISSING: 'scan_failed_files_missing',
	SHARING_FAILED: 'scan_failed',
	FINISHED: 'finished', // no missing files, ready for hashing
	HASHING: 'hashing',
	HASH_FAILED: 'hash_failed',
	HASHED: 'hashed',
	SHARED: 'shared'
};

export const PriorityEnum = {
	DEFAULT: -1,
	PAUSED_FORCED: 0,
	PAUSED: 1,
	LOWEST: 2,
	LOW: 3,
	NORMAL: 4,
	HIGH: 5,
	HIGHEST: 6,
	properties: {
		0: { str: 'Paused (forced)', id: 0 },
		1: { str: 'Paused', id: 1 },
		2: { str: 'Lowest', id: 2 },
		3: { str: 'Low', id: 3 },
		4: { str: 'Normal', id: 4 },
		5: { str: 'High', id: 5 },
		6: { str: 'Highest', id: 6 }
	}
};

export default {
	MODULE_URL: MODULE_URL,

	DUPE_PATHS_URL: MODULE_URL + '/find_dupe_paths',
	REMOVE_FILE_URL: MODULE_URL + '/remove_file',
	REMOVE_SOURCE_URL: MODULE_URL + '/remove_source',

	BUNDLES_URL: MODULE_URL + '/bundles',
	BUNDLE_URL: MODULE_URL + '/bundle',
	FILE_URL: MODULE_URL + '/file',

	BUNDLE_ADDED: 'bundle_added',
	BUNDLE_REMOVED: 'bundle_removed',
	BUNDLE_UPDATED: 'bundle_updated',
	BUNDLE_STATUS: 'bundle_status',
};
