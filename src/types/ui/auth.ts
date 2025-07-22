import * as API from '@/types/api';

export type AccessF = (access: API.AccessEnum) => boolean;

export interface AuthenticatedSession {
  systemInfo: API.SystemInfo;
  user: API.LoginUser;
  authToken: string;
  sessionId: number;

  hasAccess: AccessF;
}
