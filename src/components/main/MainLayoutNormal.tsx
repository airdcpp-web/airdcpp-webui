import { memo } from 'react';
import { Routes, useLocation } from 'react-router';
import classNames from 'classnames';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from 'components/main/SiteHeader';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import Sidebar from 'routes/Sidebar/components/Sidebar';
import { useSidebarEffect } from 'effects';
import { MainLayoutProps } from './AuthenticatedApp';

import 'normal.css';

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { className } = props;
  const location = useLocation();
  const previousLocation = useSidebarEffect(secondaryRoutes, location);
  const mainLocation = !!previousLocation ? previousLocation : location;
  return (
    <div className={classNames(className, 'pushable sidebar-context')} id="normal-layout">
      <Sidebar routes={secondaryRoutes} previousLocation={previousLocation} />
      <div className="pusher">
        <SiteHeader>
          <MainNavigation />
        </SiteHeader>
        <div className="ui site-content">
          <Routes location={mainLocation}>
            {parseRoutes([...mainRoutes, ...configRoutes])}
          </Routes>
        </div>
      </div>
      <SideMenu location={location} previousLocation={previousLocation} />
    </div>
  );
};

export default memo(MainLayout, () => true);
