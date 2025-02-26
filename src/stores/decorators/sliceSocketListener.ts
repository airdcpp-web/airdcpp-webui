import * as API from '@/types/api';
import * as UI from '@/types/ui';

export const createSessionSliceSocketListener = (
  { socket, login }: UI.StoreInitData,
  moduleUrl: string,
  listenerPrefix: string,
  access: API.AccessEnum,
): UI.SessionInitData => {
  const addSocketListener: UI.AddSliceListener = async (listenerName, callback) => {
    if (login.hasAccess(access)) {
      await socket.addListener(moduleUrl, `${listenerPrefix}_${listenerName}`, callback);
    }
  };

  return { addSocketListener, socket, login };
};
