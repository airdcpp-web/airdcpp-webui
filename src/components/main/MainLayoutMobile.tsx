import { useState, memo } from 'react';
import * as React from 'react';

import SiteHeader from 'components/main/SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import 'mobile.css';
import { MainLayoutProps } from './AuthenticatedApp';
import { MenuIcon } from 'components/action-menu';

const MainLayoutMobile: React.FC<MainLayoutProps> = memo(
  function MainLayoutMobile(props) {
    const [menuVisible, setMenuVisible] = useState(false);

    const { className, urgencies } = props;
    return (
      <div className={className} id="mobile-layout">
        <MainNavigation
          onClose={() => {
            setMenuVisible(false);
          }}
          visible={menuVisible}
        />
        <div className="pusher" id="mobile-layout-inner">
          <SiteHeader>
            <div className="right">
              <MenuIcon
                urgencies={urgencies}
                onClick={() => {
                  setMenuVisible(true);
                }}
                className="item"
              />
            </div>
          </SiteHeader>
          <div className="site-content">
            {parseRoutes([...mainRoutes, ...secondaryRoutes, ...configRoutes])}
          </div>
        </div>
      </div>
    );
  },
);

export default MainLayoutMobile;
