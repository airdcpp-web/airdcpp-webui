import { createContext, useContext } from 'react';

import * as UI from '@/types/ui';

export type SessionContextType = UI.AuthenticatedSession;
export const SessionContext = createContext<SessionContextType>(
  {} as UI.AuthenticatedSession,
);

export const useSession = () => {
  return useContext(SessionContext);
};
