import {
  DEFAULT_AUTH_RESPONSE,
  getConnectedSocket,
  getMockServer,
} from 'airdcpp-apisocket/tests';
import { DEFAULT_MOCK_PERMISSIONS, getMockSession } from './mock-session';
import { initMockSessionStore } from './mock-store';
import { createSessionStore } from '@/stores/session';
import { createAppStore } from '@/stores/app';

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

  const appStore = createAppStore();
  appStore.getState().login.onLoginCompleted(socket, session, true);

  const sessionStore = createSessionStore();
  //addMockSessionStoreInitDataHandlers(server);
  //const mockStoreListeners = addMockSessionStoreSocketListeners(
  // sessionStore,
  // initProps,
  // server,
  //);

  const mockStoreListeners = initMockSessionStore(sessionStore, initProps, server);

  return { socket, appStore, sessionStore, session, mockStoreListeners };
};
