import * as API from '@/types/api';
import * as UI from '@/types/ui';

export const createSessionSliceSocketListener = (
  { socket, login }: UI.SessionStoreInitData,
  moduleUrl: string,
  listenerPrefix: string,
  access: API.AccessEnum,
): UI.SessionInitData => {
  const addSocketListener: UI.AddSessionSliceSocketListener = async (
    listenerName,
    callback,
  ) => {
    if (login.hasAccess(access)) {
      await socket.addListener(moduleUrl, `${listenerPrefix}_${listenerName}`, callback);
    }
  };

  return { addSocketListener, socket, login };
};
