import { memo } from 'react';
import * as React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from 'components/main/SiteHeader';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import 'normal.css';
import Sidebar from 'routes/Sidebar/components/Sidebar';
import { useSidebarEffect } from 'effects';
import { MainLayoutProps } from './AuthenticatedApp';

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { className, location } = props;
  const previousLocation = useSidebarEffect(secondaryRoutes, props);
  const mainLocation = !!previousLocation ? previousLocation : location;
  return (
    <div className={className + ' pushable sidebar-context'} id="normal-layout">
      <Sidebar
        location={location}
        routes={secondaryRoutes}
        previousLocation={previousLocation}
      />
      <div className="pusher">
        <SiteHeader>
          <MainNavigation />
        </SiteHeader>
        <div className="ui site-content">
          {parseRoutes([...mainRoutes, ...configRoutes], mainLocation)}
        </div>
      </div>
      <SideMenu location={location} previousLocation={previousLocation} />
    </div>
  );
};

export default memo(MainLayout);
