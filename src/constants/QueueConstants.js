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

export default {
	MODULE_URL: MODULE_URL,

	DUPE_PATHS_URL: MODULE_URL + '/find_dupe_paths',
	REMOVE_FILE_URL: MODULE_URL + '/remove_file',
	SOURCE_URL: MODULE_URL + '/source',

	BUNDLES_URL: MODULE_URL + '/bundles',
	BUNDLE_URL: MODULE_URL + '/bundle',
	FILE_URL: MODULE_URL + '/file',

	BUNDLE_ADDED: 'queue_bundle_added',
	BUNDLE_REMOVED: 'queue_bundle_removed',
	BUNDLE_UPDATED: 'queue_bundle_updated',
	BUNDLE_STATUS: 'queue_bundle_status',
	BUNDLE_SOURCES: 'queue_bundle_sources',
};
