const MODULE_URL = 'queue';

export { QueueBundleStatusEnum as StatusEnum } from '@/types/api';

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
