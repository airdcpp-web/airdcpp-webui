import ShareConstants from '@/constants/ShareConstants';
import { ShareTempItemListResponse } from './api/share';
import { MockServer } from './mock-server';
import ShareProfileConstants from '@/constants/ShareProfileConstants';
import { ShareProfilesListResponse } from './api/share-profiles';

export const installTempShareMocks = (server: MockServer) => {
  server.addRequestHandler(
    'GET',
    ShareConstants.TEMP_SHARES_URL,
    ShareTempItemListResponse,
  );

  const tempShareItemAdded = server.addSubscriptionHandler(
    ShareConstants.MODULE_URL,
    ShareConstants.TEMP_ITEM_ADDED,
  );

  const tempShareItemRemoved = server.addSubscriptionHandler(
    ShareConstants.MODULE_URL,
    ShareConstants.TEMP_ITEM_REMOVED,
  );

  return { tempShareItemAdded, tempShareItemRemoved };
};

export const installShareProfileMocks = (server: MockServer) => {
  const profileAddedListener = server.addSubscriptionHandler(
    ShareProfileConstants.MODULE_URL,
    ShareProfileConstants.PROFILE_ADDED,
  );

  const profileUpdatedListener = server.addSubscriptionHandler(
    ShareProfileConstants.MODULE_URL,
    ShareProfileConstants.PROFILE_UPDATED,
  );

  const profileRemovedListener = server.addSubscriptionHandler(
    ShareProfileConstants.MODULE_URL,
    ShareProfileConstants.PROFILE_REMOVED,
  );

  server.addRequestHandler(
    'GET',
    ShareProfileConstants.PROFILES_URL,
    ShareProfilesListResponse,
  );

  return { profileAddedListener, profileUpdatedListener, profileRemovedListener };
};
