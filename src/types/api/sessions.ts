import { SystemInfo } from './system';
import { AccessEnum } from './web-users';

export interface LoginUser {
  username: string;
  permissions: AccessEnum[];
  active_sessions: number;
  last_login: number;
}

export interface LoginInfo {
  session_id: number;
  auth_token: string;
  token_type: string;
  refresh_token?: string;
  system_info: SystemInfo;
  user: LoginUser;
  wizard_pending: boolean;
}
