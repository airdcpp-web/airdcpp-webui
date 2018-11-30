import { SystemInfo } from './system';


export interface LoginInfo {
  auth_token: string;
  refresh_token?: string;
  system_info: SystemInfo;
  user: {
    username: string;
    permissions: string[];
    active_sessions: number;
    last_login: number;
  };
  wizard_pending: boolean;
}