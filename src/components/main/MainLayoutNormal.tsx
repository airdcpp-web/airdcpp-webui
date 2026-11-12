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

import './style.common.css';
import './style.normal.css';

import { SidebarContext } from '@/context/SidebarContext';
import { useAppStoreProperty } from '@/context/AppStoreContext';
import { LocalSettings } from '@/constants/LocalSettingConstants';

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { className, sidebarRoutes, primaryRoutes, secondaryRoutes } = props;
  const location = useLocation();
  const sideMenuPosition = useAppStoreProperty((state) =>
    state.settings.getValue<string>(LocalSettings.SIDE_MENU_POSITION),
  );
  const contentMaxWidth = useAppStoreProperty((state) =>
    state.settings.getValue<number>(LocalSettings.CONTENT_MAX_WIDTH),
  );
  const previousLocation = useSidebarEffect(sidebarRoutes, location);

  const sidebarOpen = !!previousLocation;
  const mainLocation = !!previousLocation ? previousLocation : location;

  return (
    <div
      className={classNames(className, 'pushable sidebar-context')}
      id="normal-layout"
      data-side-menu-position={sideMenuPosition}
      style={
        {
          '--site-content-max-width': contentMaxWidth
            ? `${contentMaxWidth}px`
            : 'none',
        } as React.CSSProperties
      }
    >
      <SidebarContext.Provider value={false}>
        {/* All components that can be operated normally when the sidebar is open 
        (and may open modals) should be wrapped under this provider */}
        <Sidebar routes={sidebarRoutes} previousLocation={previousLocation} />
        <SideMenu
          location={location}
          sidebarRoutes={sidebarRoutes}
          previousLocation={previousLocation}
        />
      </SidebarContext.Provider>
      <SidebarContext.Provider value={sidebarOpen}>
        <div className="pusher" aria-hidden={sidebarOpen} inert={sidebarOpen}>
          <SiteHeader>
            <MainNavigation
              primaryRoutes={primaryRoutes}
              secondaryRoutes={secondaryRoutes}
            />
          </SiteHeader>
          <div className="ui site-content">
            <Routes location={mainLocation}>
              {parseRoutes([...primaryRoutes, ...secondaryRoutes])}
            </Routes>
          </div>
        </div>
      </SidebarContext.Provider>
    </div>
  );
};

export default memo(MainLayout, () => true);
