import * as API from '@/types/api';

export interface AuthenticatedSession {
  systemInfo: API.SystemInfo;
  user: API.LoginUser;
  authToken: string;
  sessionId: number;

  hasAccess: (access: API.AccessEnum) => boolean;
}
