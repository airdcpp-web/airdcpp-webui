import { memo } from 'react';
import * as React from 'react';

import Notifications from '@/components/main/notifications/Notifications';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import AuthenticationGuardDecorator from '@/components/main/decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from '@/components/main/MainLayoutMobile';
import MainLayoutNormal from '@/components/main/MainLayoutNormal';
import { useTotalSessionUrgenciesEffect } from './effects/TotalSessionUrgenciesEffect';
import {
  PrimaryRoutes,
  SecondaryRoutes,
  RouteItem,
  SidebarRoutes,
} from '@/routes/Routes';
import { useUrgencyPageTitle } from './effects/PageTitleEffect';

import * as UI from '@/types/ui';
import { useLayoutWidth } from '@/context/LayoutWidthContext';
import { useSocket } from '@/context/SocketContext';
import { useActivityTracker } from './ActivityTracker';
import { useStoreDataFetch } from './effects/StoreDataFetchEffect';
import { LoginState } from '@/stores/reflux/LoginStore';

interface AuthenticatedAppProps {
  login: LoginState;
}

export interface MainLayoutProps {
  className?: string;
  urgencies: UI.UrgencyCountMap | null;
  primaryRoutes: RouteItem[];
  secondaryRoutes: RouteItem[];
  sidebarRoutes: RouteItem[];
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = memo(function AuthenticatedApp({
  login,
}) {
  const socket = useSocket();
  const urgencies = useTotalSessionUrgenciesEffect(SidebarRoutes);

  useStoreDataFetch(login);
  useUrgencyPageTitle(urgencies);
  useLayoutWidth(); // Update the layout in case of resize

  useActivityTracker(socket);

  const MainLayout = usingMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
  return (
    <div id="authenticated-app">
      <Notifications />
      <MainLayout
        className="main-layout"
        urgencies={urgencies}
        primaryRoutes={PrimaryRoutes}
        secondaryRoutes={SecondaryRoutes}
        sidebarRoutes={SidebarRoutes}
      />
    </div>
  );
});

export default AuthenticationGuardDecorator(AuthenticatedApp);
