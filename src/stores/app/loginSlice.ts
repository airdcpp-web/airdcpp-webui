import { Lens, lens } from '@dhmk/zustand-lens';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import {
  browserStorageUnavailable,
  loadLocalProperty,
  loadSessionProperty,
  removeLocalProperty,
  removeSessionProperty,
  saveLocalProperty,
  saveSessionProperty,
} from '@/utils/BrowserUtils';
import { ErrorResponse } from 'airdcpp-apisocket';
import { APISocket } from '@/services/SocketService';

const errorToString = (error: ErrorResponse | string) => {
  return (error as ErrorResponse).message
    ? (error as ErrorResponse).message
    : (error as string);
};

const LOGIN_PROPS_KEY = 'login_properties';
const REFRESH_TOKEN_KEY = 'refresh_token';

const formatSocketError = (error: UI.SocketError): UI.LoginError => {
  if (!error) {
    return null;
  }

  if ((error as ErrorResponse).code === 400) {
    return {
      id: 'sessionLost',
      message: 'Session lost',
    };
  } else {
    return errorToString(error);
  }
};

const formatSocketDisconnectError = (error: string): UI.LoginError => {
  if (error === '') {
    return {
      id: 'connectionClosed',
      message: 'Connection closed',
    };
  }

  return error;
};

interface LoginSliceInternal extends UI.LoginSlice {
  loginProperties: API.LoginInfo | null;

  handleDisconnect: (error: string) => void;
}

export const createLoginSlice = () => {
  const createSlice: Lens<LoginSliceInternal, UI.AppStore> = (set, get, api) => {
    const slice = {
      loginProperties: loadSessionProperty(LOGIN_PROPS_KEY, null) as API.LoginInfo | null,

      socketAuthenticated: false,
      lastError: null as UI.LoginError,
      allowLogin: true,

      init: () => {
        // The login would silently fail if data storage isn't available
        const storageError = browserStorageUnavailable();
        if (storageError) {
          set({ lastError: storageError, allowLogin: false });
        }
      },

      onLoginCompleted: (
        socket: APISocket,
        loginInfo: API.LoginInfo,
        rememberMe: boolean,
      ) => {
        set({ lastError: null, socketAuthenticated: true, loginProperties: loginInfo });
        saveSessionProperty(LOGIN_PROPS_KEY, loginInfo);

        if (rememberMe && !!loginInfo.refresh_token) {
          saveLocalProperty(REFRESH_TOKEN_KEY, loginInfo.refresh_token);
        }

        socket.onDisconnected = get().onSocketDisconnected;
      },

      // Invalid password etc.
      setLastError: (error: UI.SocketError) => {
        set({ lastError: formatSocketError(error) });
      },

      // Expired refresh token
      /*onLoginRefreshTokenFailed: (error: SocketError) => {
        get().clearData(error);
      },*/

      onNewUserIntroSeen: () => {
        const newLoginProps = {
          ...get().loginProperties!,
          wizard_pending: false,
        };

        set({ loginProperties: newLoginProps });
      },

      // Ready for use
      onConnectCompleted: (socket: APISocket) => {
        // get().setLoginProperties(loginInfo);
        set({ socketAuthenticated: true });

        socket.onDisconnected = get().onSocketDisconnected;
      },

      // Can't connect to the server or session not valid
      onConnectFailed: (error: UI.SocketError) => {
        get().resetSession(error);
      },

      hasAccess: (access: API.AccessEnum) => {
        const { permissions } = get().loginProperties!.user;
        return permissions.includes(access) || permissions.includes(API.AccessEnum.ADMIN);
      },

      onDisconnect: (reason: string) => {
        // Manual disconnect
        // Set as disconnected to prevent components from making requests (as those would throw)
        get().handleDisconnect(reason);
      },

      onSocketDisconnected: (error: string) => {
        if (!get().socketAuthenticated) {
          // Manually disconnected, handled earlier
          return;
        }

        // Connection failed or it was closed by the server
        get().handleDisconnect(error);
      },

      handleDisconnect: (error: string) => {
        set({
          socketAuthenticated: false,
          lastError: formatSocketDisconnectError(error),
        });
      },

      clear: (error: UI.SocketError = null) => {
        removeLocalProperty(REFRESH_TOKEN_KEY);

        get().resetSession(error);
      },

      resetSession: (error: UI.SocketError = null) => {
        set({
          lastError: formatSocketError(error),
          socketAuthenticated: false,
          loginProperties: null,
        });

        removeSessionProperty(LOGIN_PROPS_KEY);
      },

      getSession: () => {
        return get().loginProperties;
      },

      getRefreshToken: () => {
        return loadLocalProperty<string | null>(REFRESH_TOKEN_KEY, null);
      },
    };

    return slice;
  };

  return createSlice;
};

export const initLoginStore = (appStore: UI.AppStore) => {
  appStore.login.init();
};

export const createLoginStore = () => {
  return lens<LoginSliceInternal, UI.AppStore>((...a) => ({
    ...createLoginSlice()(...a),
  }));
};
