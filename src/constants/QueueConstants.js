const QUEUE_MODULE_URL = 'queue/v0';
export default {
	QUEUE_MODULE_URL: QUEUE_MODULE_URL,

	QUEUE_DUPE_PATHS_URL: QUEUE_MODULE_URL + '/find_dupe_paths',

	BUNDLES_URL: QUEUE_MODULE_URL + '/bundles',
	BUNDLE_URL: QUEUE_MODULE_URL + '/bundle',

	BUNDLE_ADDED: 'bundle_added',
	BUNDLE_REMOVED: 'bundle_removed',
	BUNDLE_UPDATED: 'bundle_updated',
	BUNDLE_STATUS: 'bundle_status',

	FILELIST_URL: QUEUE_MODULE_URL + '/filelist',

	StatusEnum: {
		STATUS_QUEUED: 1,
		STATUS_DOWNLOAD_FAILED: 2,
		STATUS_RECHECK: 3,
		STATUS_DOWNLOADED: 4, // no queued files
		STATUS_MOVED: 5, // all files moved
		STATUS_FAILED_MISSING: 6,
		STATUS_SHARING_FAILED: 7,
		STATUS_FINISHED: 8, // no missing files, ready for hashing
		STATUS_HASHING: 9,
		STATUS_HASH_FAILED: 10,
		STATUS_HASHED: 11,
		STATUS_SHARED:12
	},

	PriorityEnum: {
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
	}
};
