//@ts-ignore
import Reflux from 'reflux';

import { 
  loadLocalProperty, saveLocalProperty, removeLocalProperty,
  loadSessionProperty, saveSessionProperty, removeSessionProperty 
} from 'utils/BrowserUtils';

import LoginActions from 'actions/reflux/LoginActions';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { AccessEnum } from 'types/api';
import { ErrorResponse } from 'airdcpp-apisocket';
import { i18n } from 'services/LocalizationService';
import { translate } from 'utils/TranslationUtils';


export interface LoginState {
  socketAuthenticated: boolean;
  lastError: string | null;
  hasSession: boolean;
  allowLogin: boolean;
  showNewUserIntro: boolean;
}


const errorToString = (error: ErrorResponse | string) => {
  return (error as ErrorResponse).message ? (error as ErrorResponse).message : error as string;
};

const LOGIN_PROPS_KEY = 'login_properties';
const REFRESH_TOKEN_KEY = 'refresh_token';

const LoginStore = {
  listenables: LoginActions,
  loginProperties: loadSessionProperty(LOGIN_PROPS_KEY, null) as API.LoginInfo | null,

  _allowLogin: true,
  _lastError: null as string | null,
  _socketAuthenticated: false,

  init: function () {

    // The login would silently fail if data storage isn't available
    try {
      sessionStorage.setItem('storage_test', 'test');
      sessionStorage.removeItem('storage_test');
    } catch (e) {
      if (e.code === DOMException.QUOTA_EXCEEDED_ERR && sessionStorage.length === 0) {
        // Safari and private mode
        this._lastError = i18n.t<string>(
          'privateBrowsingNotSupported', 
          `This site can't be used with your browser if private browsing mode is enabled`
        );
        this._allowLogin = false;
      } else {
        this._lastError = i18n.t<string>(
          'dataStorageNotSupported',
          `This site can't be used with your browser because it doesn't support data storage`
        );
        this._allowLogin = false;
      }
    }

    // We must handle disconnected sockets
    SocketService.onDisconnected = this.onSocketDisconnected;

    (this as any).getInitialState = this.getState;
  },

  onLogin(res: API.LoginInfo) {
    //this.reset();
    //invariant(!this.loginProperties, 'Login propertias ');
  },

  getState(): LoginState {
    return {
      allowLogin: this._allowLogin,
      lastError: this._lastError,
      socketAuthenticated: this._socketAuthenticated,
      hasSession: this.hasSession,
      showNewUserIntro: this.showNewUserIntro,
    };
  },

  onLoginCompleted(res: API.LoginInfo, rememberMe: boolean) {
    this._lastError = null;
    this._socketAuthenticated = true;

    this.setLoginProperties(res);
    if (rememberMe && !!res.refresh_token) {
      saveLocalProperty(REFRESH_TOKEN_KEY, res.refresh_token);
    }

    (this as any).trigger(this.getState());
  },

  onLoginRefreshTokenCompleted(res: API.LoginInfo) {
    this.onLoginCompleted(res, true);
  },

  setLoginProperties(props: API.LoginInfo) {
    this.loginProperties = props;
    saveSessionProperty(LOGIN_PROPS_KEY, props);
  },

  // Invalid password etc.
  onLoginFailed(error: ErrorResponse | string) {
    this._lastError = errorToString(error);
    (this as any).trigger(this.getState());
  },

  setLoginError(error: ErrorResponse | string) {
    if ((error as ErrorResponse).code === 400) {
      this._lastError = translate('Session lost', i18n.t.bind(i18n), UI.Modules.LOGIN);
    } else { 
      this._lastError = errorToString(error);
    }
  },

  // Expired refresh token
  onLoginRefreshTokenFailed(error: ErrorResponse | string) {
    this.clearData();
    this.setLoginError(error);

    (this as any).trigger(this.getState());
  },

  onNewUserIntroSeen() {
    const newLoginProps = {
      ...this.loginProperties!,
      wizard_pending: false,
    };

    this.setLoginProperties(newLoginProps);

    (this as any).trigger(this.getState());
  },

  // Ready for use
  onConnectCompleted() {
    this._socketAuthenticated = true;
    (this as any).trigger(this.getState());
  },

  // Can't connect to the server or session not valid
  onConnectFailed(error: ErrorResponse | string) {
    this.resetSession();
    this.setLoginError(error);

    (this as any).trigger(this.getState());
  },

  hasAccess(access: AccessEnum) {
    const { permissions } = this.loginProperties!.user;
    return permissions.indexOf(access) !== -1 || permissions.indexOf(AccessConstants.ADMIN) !== -1;
  },

  onDisconnect(reason: string) {
    // Manual disconnect 
    // Set as disconnected to prevent components from making requests (as those would throw)
    this.handleDisconnect(reason);
  },

  onSocketDisconnected(error: string) {
    if (!this._socketAuthenticated) {
      // Manually disconnected, handled earlier
      return;
    }

    // Connection failed or it was closed by the server
    this.handleDisconnect(error);
  },

  
  handleDisconnect(error: string) {
    this._socketAuthenticated = false;
    if (this.user) {
      if (error === '') {
        this._lastError = translate('Connection closed', i18n.t.bind(i18n), UI.Modules.LOGIN);
      } else {
        this._lastError = error;
      }
    }

    (this as any).trigger(this.getState());
  },

  onLogoutCompleted() {
    this.clearData();
    (this as any).trigger(this.getState());
  },

  clearData() {
    removeLocalProperty(REFRESH_TOKEN_KEY);
    this.resetSession();
  },

  resetSession() {
    this._lastError = null;
    this._socketAuthenticated = false;
    this.loginProperties = null;

    removeSessionProperty(LOGIN_PROPS_KEY);
  },

  get lastError() {
    return this._lastError;
  },

  get socketAuthenticated() {
    return this._socketAuthenticated;
  },

  get user() {
    return this.loginProperties ? this.loginProperties.user : null;
  },

  get hasSession() {
    return this.loginProperties ? !!this.loginProperties.user : false;
  },

  get authToken() {
    return this.loginProperties ? this.loginProperties.auth_token : null;
  },

  get sessionId() {
    return this.loginProperties ? this.loginProperties.session_id : null;
  },

  get systemInfo() {
    return this.loginProperties ? this.loginProperties.system_info : null;
  },

  get showNewUserIntro() {
    return this.loginProperties ? this.loginProperties.wizard_pending : false;
  },

  get allowLogin() {
    return this._allowLogin;
  },

  get refreshToken() {
    return loadLocalProperty<string | null>(REFRESH_TOKEN_KEY, null);
  },
};

export default Reflux.createStore(LoginStore);