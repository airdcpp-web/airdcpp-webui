import { memo } from 'react';
import * as React from 'react';

import ActivityTracker from 'components/main/ActivityTracker';
import Notifications from 'components/main/Notifications';
import { useMobileLayout } from 'utils/BrowserUtils';

import AuthenticationGuardDecorator from 'components/main/decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from 'components/main/MainLayoutMobile';
import MainLayoutNormal from 'components/main/MainLayoutNormal';
import { useTotalSessionUrgenciesEffect } from './effects/TotalSessionUrgenciesEffect';
import { secondaryRoutes } from 'routes/Routes';
import { useUrgencyPageTitle } from './effects/PageTitleEffect';

import * as UI from 'types/ui';
import { Outlet } from 'react-router';

interface AuthenticatedAppProps {}

export type MainLayoutProps = React.PropsWithChildren<{
  className?: string;
  urgencies: UI.UrgencyCountMap | null;
}>;

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = memo(
  function AuthenticatedApp(props) {
    const urgencies = useTotalSessionUrgenciesEffect(secondaryRoutes);
    useUrgencyPageTitle(urgencies);

    const MainLayout = useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker />
        <Notifications />
        <MainLayout className="main-layout" urgencies={urgencies}>
          <Outlet />
        </MainLayout>
      </div>
    );
  },
);

export default AuthenticationGuardDecorator(AuthenticatedApp);
