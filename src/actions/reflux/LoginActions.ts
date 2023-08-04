//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';

const LoginActionConfig: UI.RefluxActionConfigList<any> = [
  { login: { asyncResult: true } },
  { loginRefreshToken: { asyncResult: true } },
  { connect: { asyncResult: true } },
  'disconnect',
  { logout: { asyncResult: true } },
];

const LoginActions = Reflux.createActions(LoginActionConfig);

LoginActions.login.listen(function (
  this: UI.AsyncActionType<any>,
  username: string,
  password: string,
  rememberMe: boolean,
) {
  const that = this;

  SocketService.connect(username, password, false)
    .then((data) => that.completed(data, rememberMe))
    .catch(that.failed);
});

LoginActions.loginRefreshToken.listen(async function (
  this: UI.AsyncActionType<any>,
  refreshToken: string,
) {
  try {
    await SocketService.waitDisconnected();

    const res = await SocketService.connectRefreshToken(refreshToken, true);
    this.completed(res);
  } catch (e) {
    this.failed(e);
  }
});

LoginActions.login.failed.listen(function (error: ErrorResponse) {
  console.log('Logging in failed', error);
});

LoginActions.disconnect.listen(function (reason: string) {
  SocketService.disconnect(false, reason);
});

LoginActions.connect.listen(async function (
  this: UI.AsyncActionType<any>,
  token: string,
) {
  try {
    await SocketService.waitDisconnected();

    const res = await SocketService.reconnect(token);
    this.completed(res);
  } catch (e) {
    this.failed(e);
  }
});

LoginActions.logout.listen(function (this: UI.AsyncActionType<any>) {
  const that = this;
  return SocketService.logout().then(that.completed).catch(this.failed);
});

export default LoginActions as UI.RefluxActionListType<void>;
