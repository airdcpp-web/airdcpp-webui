import { memo } from 'react';
import { Routes, useLocation } from 'react-router';
import classNames from 'classnames';

import MainNavigation from '@/components/main/navigation/MainNavigationNormal';
import SideMenu from '@/components/main/navigation/SideMenu';
import SiteHeader from '@/components/main/SiteHeader';

import { parseRoutes } from '@/routes/Routes';

import Sidebar from '@/routes/Sidebar/components/Sidebar';
import { useSidebarEffect } from '@/effects';
import { MainLayoutProps } from './AuthenticatedApp';

import '@/normal.css';

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { className, sidebarRoutes, primaryRoutes, secondaryRoutes } = props;
  const location = useLocation();
  const previousLocation = useSidebarEffect(sidebarRoutes, location);
  const mainLocation = !!previousLocation ? previousLocation : location;
  return (
    <div className={classNames(className, 'pushable sidebar-context')} id="normal-layout">
      <Sidebar routes={sidebarRoutes} previousLocation={previousLocation} />
      <div className="pusher">
        <SiteHeader>
          <MainNavigation
            primaryRoutes={primaryRoutes}
            secondaryRoutes={secondaryRoutes}
          />
        </SiteHeader>
        <div className="ui site-content">
          <Routes location={mainLocation}>{parseRoutes(primaryRoutes)}</Routes>
        </div>
      </div>
      <SideMenu
        location={location}
        sidebarRoutes={sidebarRoutes}
        previousLocation={previousLocation}
      />
    </div>
  );
};

export default memo(MainLayout, () => true);
