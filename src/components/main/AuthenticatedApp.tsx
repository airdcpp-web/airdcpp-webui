'use strict';
import React, { memo } from 'react';
import { RouteComponentProps } from 'react-router-dom';

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


interface AuthenticatedAppProps extends RouteComponentProps<{}> {

}

export interface MainLayoutProps extends RouteComponentProps {
  className?: string;
  urgencies: UI.UrgencyCountMap | null;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = memo(props => {
  const { location } = props;

  const urgencies = useTotalSessionUrgenciesEffect(secondaryRoutes);
  useUrgencyPageTitle(urgencies);

  const MainLayout = useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
  return (
    <div id="authenticated-app">
      <ActivityTracker/>
      <Notifications location={ location }/>
      <MainLayout 
        className="main-layout" 
        urgencies={urgencies}
        { ...props } 
      />
    </div>
  );
});

export default AuthenticationGuardDecorator(AuthenticatedApp);
