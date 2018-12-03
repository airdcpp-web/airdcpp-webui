'use strict';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ActivityTracker from 'components/main/ActivityTracker';
import Notifications from 'components/main/Notifications';
import { useMobileLayout } from 'utils/BrowserUtils';

import AuthenticationGuardDecorator from 'components/main/decorators/AuthenticationGuardDecorator';
import MainLayoutMobile from 'components/main/MainLayoutMobile';
import MainLayoutNormal from 'components/main/MainLayoutNormal';


interface AuthenticatedAppProps extends RouteComponentProps<{}> {

}

export interface MainLayoutProps extends RouteComponentProps {
  className?: string;
}

class AuthenticatedApp extends React.Component<AuthenticatedAppProps> {
  render() {
    const { location } = this.props;

    const MainLayout = useMobileLayout() ? MainLayoutMobile : MainLayoutNormal;
    return (
      <div id="authenticated-app">
        <ActivityTracker/>
        <Notifications location={ location }/>
        <MainLayout 
          className="main-layout" 
          { ...this.props } 
        />
      </div>
    );
  }
}

export default AuthenticationGuardDecorator(AuthenticatedApp);
