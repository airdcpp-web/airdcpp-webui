import { DEFAULT_AUTH_RESPONSE, MockSocketConnectOptions } from 'airdcpp-apisocket/tests';
import { DEFAULT_MOCK_PERMISSIONS, getMockSession } from './mock-session';
import { initMockSessionStore } from './mock-store';
import { createSessionStore } from '@/stores/session';
import { createAppStore } from '@/stores/app';
import { getConnectedSocket, MockServer } from './mock-server';

import * as API from '@/types/api';

interface MockInitProps {
  permissions?: API.AccessEnum[];
  socketOptions?: Partial<MockSocketConnectOptions>;
}

export const initCommonDataMocks = async (
  server: MockServer,
  props: Partial<MockInitProps> = {},
) => {
  const { permissions = DEFAULT_MOCK_PERMISSIONS, socketOptions } = props;

  // Socket
  const { socket } = await getConnectedSocket(server, {
    socketOptions: {
      // logLevel: 'verbose',
      ...socketOptions,
    },
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
  const mockStoreListeners = await initMockSessionStore(sessionStore, initProps, server);

  return { socket, appStore, sessionStore, session, mockStoreListeners };
};
