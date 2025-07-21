import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';
import { getMockSession } from './mock-session';
import { createAppStore } from '@/stores';
import { addMockStoreInitDataHandlers, addMockStoreSocketListeners } from './mock-store';

export const initCommonDataMocks = async (server: ReturnType<typeof getMockServer>) => {
  // Socket
  const { socket } = await getConnectedSocket(server, {
    socketOptions: {
      logLevel: 'verbose',
    },
  });

  // Session
  const session = getMockSession();

  // Store
  const initProps = {
    login: session,
    socket,
  };

  const store = createAppStore();
  addMockStoreInitDataHandlers(server);
  const mockStoreListeners = addMockStoreSocketListeners(store, initProps, server);
  return { socket, store, session, mockStoreListeners };
};
