import { memo } from 'react';
import * as React from 'react';

import classNames from 'classnames';
import { UNSAFE_RouteContext } from 'react-router-dom';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import Sidebar from 'routes/Sidebar/components/Sidebar';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from 'components/main/SiteHeader';

import { secondaryRoutes } from 'routes/Routes';

import { useSidebarEffect } from 'effects';
import { MainLayoutProps } from './AuthenticatedApp';

import 'normal.css';

const MainLayout: React.FC<MainLayoutProps> = ({ className, children }) => {
  const { outlet } = React.useContext(UNSAFE_RouteContext);
  const previousMainLayout = useSidebarEffect(secondaryRoutes, outlet);
  return (
    <div className={classNames(className, 'pushable sidebar-context')} id="normal-layout">
      <Sidebar routes={secondaryRoutes} previousLocation={previousMainLayout?.location}>
        {outlet}
      </Sidebar>
      <div className="pusher">
        <SiteHeader>
          <MainNavigation />
        </SiteHeader>
        <div className="ui site-content">
          {!!previousMainLayout ? previousMainLayout.children : outlet}
        </div>
      </div>
      <SideMenu previousLocation={previousMainLayout?.location} />
    </div>
  );
};

export default memo(MainLayout, () => true);
