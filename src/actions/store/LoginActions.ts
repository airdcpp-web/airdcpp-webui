import { APISocket } from '@/services/SocketService';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

interface LoginProperties {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginActionProps {
  socket: APISocket;
  appStore: UI.AppStore;
}

const loginCredentials = async (
  { username, password, rememberMe }: LoginProperties,
  { socket, appStore }: LoginActionProps,
) => {
  try {
    const response = await socket.connect(username, password, false);
    appStore.login.onLoginCompleted(socket, response as API.LoginInfo, rememberMe);
  } catch (e) {
    appStore.login.setLastError(e);
  }
};

const loginRefreshToken = async (
  refreshToken: string,
  { socket, appStore }: LoginActionProps,
) => {
  await socket.waitDisconnected();
  try {
    const response = await socket.connectRefreshToken(refreshToken, true);
    appStore.login.onLoginCompleted(socket, response as API.LoginInfo, true);
  } catch (e) {
    appStore.login.clear(e);
  }
};

const disconnect = (reason: string, socket: APISocket) => {
  socket.disconnect(false, reason);
};

const connect = async (token: string, { socket, appStore }: LoginActionProps) => {
  try {
    await socket.waitDisconnected();
    await socket.reconnect(token);
    appStore.login.onConnectCompleted(socket);
  } catch (e) {
    appStore.login.resetSession(e);
  }
};

const logout = async ({ socket, appStore }: LoginActionProps) => {
  try {
    await socket.logout();
    appStore.login.clear();
  } catch (e) {
    console.log('Logging out failed', e);
  }
};

export const LoginAPIActions = {
  loginCredentials,
  loginRefreshToken,
  connect,
  disconnect,
  logout,
};
