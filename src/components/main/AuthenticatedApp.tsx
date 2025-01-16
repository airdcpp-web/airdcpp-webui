import { memo } from 'react';
import * as React from 'react';

import ActivityTracker from 'components/main/ActivityTracker';
import Notifications from 'components/main/Notifications';
import { usingMobileLayout } from 'utils/BrowserUtils';

import AuthenticationGuardDecorator from 'components/main/decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from 'components/main/MainLayoutMobile';
import MainLayoutNormal from 'components/main/MainLayoutNormal';
import { useTotalSessionUrgenciesEffect } from './effects/TotalSessionUrgenciesEffect';
import { secondaryRoutes } from 'routes/Routes';
import { useUrgencyPageTitle } from './effects/PageTitleEffect';

import * as UI from 'types/ui';
import { useLayoutWidth } from 'context/LayoutWidthContext';
import { useSocket } from 'context/SocketContext';

interface AuthenticatedAppProps {}

export interface MainLayoutProps {
  className?: string;
  urgencies: UI.UrgencyCountMap | null;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = memo(
  function AuthenticatedApp(props) {
    const socket = useSocket();
    const urgencies = useTotalSessionUrgenciesEffect(secondaryRoutes);
    useUrgencyPageTitle(urgencies);
    useLayoutWidth(); // Update the layout in case of resize

    const MainLayout = usingMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker socket={socket} />
        <Notifications />
        <MainLayout className="main-layout" urgencies={urgencies} />
      </div>
    );
  },
);

export default AuthenticationGuardDecorator(AuthenticatedApp);
