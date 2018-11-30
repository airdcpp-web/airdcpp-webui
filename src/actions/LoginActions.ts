'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import LoginConstants from 'constants/LoginConstants';
import SettingConstants from 'constants/SettingConstants';

//import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';


const LoginActionConfig: UI.ActionConfigList<any> = [
  { 'login': { asyncResult: true } },
  { 'loginRefreshToken': { asyncResult: true } },
  { 'connect': { asyncResult: true } },
  { 'logout': { asyncResult: true } },
  { 'activity': { asyncResult: true } },
  { 'newUserIntroSeen': {
    asyncResult: true,
    displayName: `Close and don't show again`,
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.SAVE,
  } },
];

const LoginActions = Reflux.createActions(LoginActionConfig);

LoginActions.activity.listen(function (this: UI.AsyncActionType<any>) {
  let that = this;
  return SocketService.post(LoginConstants.ACTIVITY_URL, {
    user_active: true,
  })
    .then(that.completed)
    .catch(that.failed);
});

LoginActions.newUserIntroSeen.listen(function (this: UI.AsyncActionType<any>) {
  let that = this;
  return SocketService.post(SettingConstants.ITEMS_SET_URL, { [LoginConstants.WIZARD_PENDING]: false })
    .then(that.completed)
    .catch(that.failed);
});

LoginActions.login.listen(function (
  this: UI.AsyncActionType<any>,
  username: string, 
  password: string, 
  rememberMe: boolean
) {
  let that = this;

  SocketService.connect(username, password, false)
    .then(data => that.completed(data, rememberMe))
    .catch(that.failed);
});


LoginActions.loginRefreshToken.listen(function (
  this: UI.AsyncActionType<any>,
  refreshToken: string
) {
  let that = this;

  SocketService.connectRefreshToken(refreshToken, true)
    .then(that.completed)
    .catch(that.failed);
});

LoginActions.login.failed.listen(function (error: ErrorResponse) {
  console.log('Logging in failed', error);
});


LoginActions.connect.listen(function (this: UI.AsyncActionType<any>, token: string) {
  let that = this;

  SocketService.reconnect(token)
    .then(that.completed)
    .catch(that.failed);
});

/*LoginActions.connect.failed.listen(function (token) {

});*/

LoginActions.logout.listen(function (this: UI.AsyncActionType<any>) {
  let that = this;
  return SocketService.logout()
    .then(that.completed)
    .catch(this.failed);
});


export default LoginActions;
