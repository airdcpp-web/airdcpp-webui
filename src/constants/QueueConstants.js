const QUEUE_MODULE_URL = 'queue/v0';
export default {
  QUEUE_MODULE_URL: QUEUE_MODULE_URL,

  QUEUE_DUPE_PATHS_URL: QUEUE_MODULE_URL + '/find_dupe_paths',

  BUNDLES_URL: QUEUE_MODULE_URL + '/bundles',
  BUNDLE_URL: QUEUE_MODULE_URL + '/bundle',

  BUNDLE_ADDED: 'BUNDLE_ADDED',
  BUNDLE_REMOVED: 'BUNDLE_REMOVED',
  BUNDLE_UPDATED: 'BUNDLE_UPDATED',
  BUNDLES_GET: 'BUNDLES_GET',

  FILELIST_URL: QUEUE_MODULE_URL + '/filelist',

  StatusEnum: {
    STATUS_QUEUED: 1,
    STATUS_RECHECK: 2,
    STATUS_DOWNLOADED: 3, // no queued files
    STATUS_MOVED: 4, // all files moved
    STATUS_FAILED_MISSING: 5,
    STATUS_SHARING_FAILED: 6,
    STATUS_FINISHED: 7, // no missing files, ready for hashing
    STATUS_HASHING: 8,
    STATUS_HASH_FAILED: 9,
    STATUS_HASHED: 10,
    STATUS_SHARED:11
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
	    0: {str: "Paused (forced)", id: 0},
	    1: {str: "Paused", id: 1},
	    2: {str: "Lowest", id: 2},
	    3: {str: "Low", id: 3},
	    4: {str: "Normal", id: 4},
	    5: {str: "High", id: 5},
	    6: {str: "Highest", id: 6}
	  }
	}
}
