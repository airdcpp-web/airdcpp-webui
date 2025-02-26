import * as API from '@/types/api';

import SocketService from '@/services/SocketService';
import FavoriteHubConstants from '@/constants/FavoriteHubConstants';

export const updateFavoriteHub = (
  hub: API.FavoriteHubEntry,
  data: Partial<API.FavoriteHubEntryBase>,
) => {
  return SocketService.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data);
};
