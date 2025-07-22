import { useState, memo } from 'react';
import { Routes } from 'react-router';

import SiteHeader from '@/components/main/SiteHeader';
import MainNavigation from '@/components/main/navigation/MainNavigationMobile';

import { parseRoutes } from '@/routes/Routes';

import { MainLayoutProps } from './AuthenticatedApp';
import { MenuIcon } from '@/components/action-menu';

import './style.common.css';
import './style.mobile.css';

const MainLayoutMobile: React.FC<MainLayoutProps> = memo(
  function MainLayoutMobile(props) {
    const [menuVisible, setMenuVisible] = useState(false);

    const { className, urgencies, primaryRoutes, secondaryRoutes, sidebarRoutes } = props;
    return (
      <div className={className} id="mobile-layout">
        <MainNavigation
          primaryRoutes={primaryRoutes}
          secondaryRoutes={secondaryRoutes}
          sidebarRoutes={sidebarRoutes}
          onClose={() => {
            setMenuVisible(false);
          }}
          visible={menuVisible}
        />
        <div className="pusher" id="mobile-layout-inner">
          <SiteHeader>
            <div className="right">
              <MenuIcon
                label="Mobile menu"
                urgencies={urgencies}
                onClick={() => {
                  setMenuVisible(true);
                }}
                className="item"
              />
            </div>
          </SiteHeader>
          <div className="site-content">
            <Routes>
              {parseRoutes([...primaryRoutes, ...secondaryRoutes, ...sidebarRoutes])}
            </Routes>
          </div>
        </div>
      </div>
    );
  },
);

export default MainLayoutMobile;
