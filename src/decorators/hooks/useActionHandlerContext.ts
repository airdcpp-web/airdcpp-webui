import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import * as UI from '@/types/ui';

import { useSocket } from '@/context/SocketContext';
import { useSessionStoreApi } from '@/context/SessionStoreContext';
import { useAppStoreApi } from '@/context/AppStoreContext';

/**
 * Shared hook for action handler context.
 * Provides common dependencies needed by action handlers.
 */
export const useActionHandlerContext = () => {
  const socket = useSocket();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionStoreApi = useSessionStoreApi();
  const appStoreApi = useAppStoreApi();

  const getHandlerProps = useCallback(
    (): UI.ActionHandlerProps => ({
      location,
      navigate,
      t,
      socket,
      sessionStore: sessionStoreApi.getState(),
      appStore: appStoreApi.getState(),
    }),
    [location, navigate, t, socket, sessionStoreApi, appStoreApi],
  );

  return {
    socket,
    t,
    location,
    navigate,
    sessionStoreApi,
    appStoreApi,
    getHandlerProps,
  };
};
