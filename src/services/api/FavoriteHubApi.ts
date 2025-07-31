import * as API from '@/types/api';

import { APISocket } from '@/services/SocketService';
import FavoriteHubConstants from '@/constants/FavoriteHubConstants';

export const updateFavoriteHub = (
  hub: API.FavoriteHubEntry,
  data: Partial<API.FavoriteHubEntryBase>,
  socket: APISocket,
) => {
  return socket.patch(FavoriteHubConstants.HUBS_URL + '/' + hub.id, data);
};
