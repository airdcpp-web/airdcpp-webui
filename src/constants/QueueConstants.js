const MODULE_URL = 'queue';

export const StatusEnum = {
  QUEUED: 'queued',
  DOWNLOAD_FAILED: 'download_error',
  RECHECK: 'recheck',
  DOWNLOADED: 'downloaded', // no queued files remaining
  COMPLETION_VALIDATION_RUNNING: 'completion_validation_running', // running validation hooks (such as share scanner)
  COMPLETION_VALIDATION_ERROR: 'completion_validation_error',
  COMPLETED: 'completed', // ready for sharing
  SHARED: 'shared'
};

export default {
  MODULE_URL: MODULE_URL,

  DUPE_PATHS_URL: MODULE_URL + '/find_dupe_paths',
  SOURCES_URL: MODULE_URL + '/sources',

  BUNDLES_URL: MODULE_URL + '/bundles',
  FILES_URL: MODULE_URL + '/files',

  BUNDLE_ADDED: 'queue_bundle_added',
  BUNDLE_REMOVED: 'queue_bundle_removed',
  BUNDLE_UPDATED: 'queue_bundle_updated',
  BUNDLE_STATUS: 'queue_bundle_status',
  BUNDLE_SOURCES: 'queue_bundle_sources',
};
