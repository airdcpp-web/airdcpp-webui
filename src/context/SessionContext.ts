import { createContext, useContext } from 'react';

import * as API from 'types/api';

export interface AuthenticatedSession {
  systemInfo: API.SystemInfo;
  hasAccess: (access: API.AccessEnum) => boolean;
  user: API.LoginUser;
  authToken: string;
  sessionId: number;
}

export type SessionContextType = AuthenticatedSession;
export const SessionContext = createContext<SessionContextType>(
  {} as AuthenticatedSession,
);

export const useSession = () => {
  return useContext(SessionContext);
  // return LoginStore as Login;
};
