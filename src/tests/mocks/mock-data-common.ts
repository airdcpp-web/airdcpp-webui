import {
  DEFAULT_AUTH_RESPONSE,
  getConnectedSocket,
  getMockServer,
} from 'airdcpp-apisocket/tests';
import { DEFAULT_MOCK_PERMISSIONS, getMockSession } from './mock-session';
import { createAppStore } from '@/stores';
import { addMockStoreInitDataHandlers, addMockStoreSocketListeners } from './mock-store';

export const initCommonDataMocks = async (
  server: ReturnType<typeof getMockServer>,
  permissions = DEFAULT_MOCK_PERMISSIONS,
) => {
  // Socket
  const { socket } = await getConnectedSocket(server, {
    //socketOptions: {
    //  logLevel: 'verbose',
    //},
    authResponse: {
      ...DEFAULT_AUTH_RESPONSE,
      user: {
        ...DEFAULT_AUTH_RESPONSE.user,
        permissions,
      },
    },
  });

  // Session
  const session = getMockSession(permissions);

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
