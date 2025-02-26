//@ts-ignore
import Reflux from 'reflux';
import { APISocket } from '@/services/SocketService';

import * as UI from '@/types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

const LoginActionConfig: UI.RefluxActionConfigList<any> = [
  { login: { asyncResult: true } },
  { loginRefreshToken: { asyncResult: true } },
  { connect: { asyncResult: true } },
  'disconnect',
  { logout: { asyncResult: true } },
];

const LoginActions = Reflux.createActions(LoginActionConfig);

interface LoginProperties {
  username: string;
  password: string;
  rememberMe: boolean;
}

LoginActions.login.listen(function (
  this: UI.AsyncActionType<any>,
  { username, password, rememberMe }: LoginProperties,
  socket: APISocket,
) {
  const that = this;

  socket
    .connect(username, password, false)
    .then((data) => that.completed(data, rememberMe))
    .catch(that.failed);
});

LoginActions.loginRefreshToken.listen(async function (
  this: UI.AsyncActionType<any>,
  refreshToken: string,
  socket: APISocket,
) {
  try {
    await socket.waitDisconnected();

    const res = await socket.connectRefreshToken(refreshToken, true);
    this.completed(res);
  } catch (e) {
    this.failed(e);
  }
});

LoginActions.login.failed.listen(function (error: ErrorResponse) {
  console.log('Logging in failed', error);
});

LoginActions.disconnect.listen(function (reason: string, socket: APISocket) {
  socket.disconnect(false, reason);
});

LoginActions.connect.listen(async function (
  this: UI.AsyncActionType<any>,
  token: string,
  socket: APISocket,
) {
  try {
    await socket.waitDisconnected();

    const res = await socket.reconnect(token);
    this.completed(res);
  } catch (e) {
    this.failed(e);
  }
});

LoginActions.logout.listen(function (this: UI.AsyncActionType<any>, socket: APISocket) {
  const that = this;
  return socket.logout().then(that.completed).catch(this.failed);
});

export default LoginActions as UI.RefluxActionListType<void>;
