import { ErrorResponse } from 'airdcpp-apisocket';
import { TranslatableMessage } from './common';
import { FormValueBase, FormValueMap } from './form';

import * as API from '@/types/api';
import { APISocket } from '@/services/SocketService';
// import { AuthenticatedSession } from './auth';

export type LocalSettingValues = FormValueMap;

export interface LocalSettingsSlice {
  settings: LocalSettingValues;

  init(): void;

  getValue<ValueType extends FormValueBase>(key: string): ValueType;
  setValue(key: string, value: FormValueBase): void;
  setValues(items: Partial<LocalSettingValues>): void;
}

export type LoginError = TranslatableMessage | string | null;
export type SocketError = ErrorResponse | string | null;

export interface LoginState {
  socketAuthenticated: boolean;
  lastError: LoginError;
  // hasSession: boolean;
  allowLogin: boolean;

  // hasAccess: (access: API.AccessEnum) => boolean;

  // showNewUserIntro: boolean;
  // authToken: string | null;
  // refreshToken: string | null;
  // systemInfo: API.SystemInfo | null;

  // session: API.LoginInfo | null;
}

interface LoginActions {
  setLastError: (error: SocketError) => void;

  resetSession: (error?: SocketError) => void;
  clear: (error?: SocketError) => void;

  onLoginCompleted: (
    socket: APISocket,
    loginInfo: API.LoginInfo,
    rememberMe: boolean,
  ) => void;
  onNewUserIntroSeen: () => void;
  onConnectCompleted: (socket: APISocket) => void;

  onSocketDisconnected: (error: string) => void;

  init(): void;
}

interface LoginGetters {
  getSession: () => API.LoginInfo | null;
  getRefreshToken: () => string | null;
}

export type LoginSlice = LoginActions & LoginGetters & LoginState;
// loginProperties: API.LoginInfo | null;

/*socketAuthenticated: boolean;
  lastError: LoginError;
  allowLogin: boolean;*/

export interface AppStore {
  login: LoginSlice;
  settings: LocalSettingsSlice;
}
