import ShareConstants from '@/constants/ShareConstants';
import { ShareTempItemListResponse } from './api/share';
import { MockServer } from './mock-server';

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
