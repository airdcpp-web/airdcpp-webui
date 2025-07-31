import * as API from '@/types/api';

/*export interface AuthenticatedSession {
  systemInfo: API.SystemInfo;
  user: API.LoginUser;
  authToken: string;
  sessionId: number;

  showNewUserIntro: boolean;

  hasAccess: (access: API.AccessEnum) => boolean;
}*/

export type AuthenticatedSession = API.LoginInfo;
