import { useCallback } from 'react';

import IconPanel from '@/components/main/navigation/IconPanel';
import { matchPath, Location, useNavigate } from 'react-router';
import { parseMenuItems, RouteItemClickHandler, HOME_URL } from '@/routes/Routes';
import { useSession } from '@/context/AppStoreContext';
import { MainLayoutProps } from '../AuthenticatedApp';

interface SideMenuProps extends Pick<MainLayoutProps, 'sidebarRoutes'> {
  location: Location;
  previousLocation?: Location;
}

const SideMenu: React.FC<SideMenuProps> = ({
  location,
  previousLocation,
  sidebarRoutes,
}) => {
  const navigate = useNavigate();
  const login = useSession();

  const onClick: RouteItemClickHandler = useCallback(
    (url, evt) => {
      evt.preventDefault();

      const isActive = matchPath(`${url}/*`, location.pathname);

      if (isActive) {
        if (!!previousLocation) {
          navigate(previousLocation.pathname, {
            replace: true,
            state: previousLocation.state,
          });
        } else {
          navigate(HOME_URL, { replace: true });
        }
      } else {
        navigate(url);
      }
    },
    [location],
  );

  const menuItems = parseMenuItems(sidebarRoutes, login, onClick);
  return (
    <div id="side-menu">
      {menuItems.length > 0 && (
        <div
          className="content navigation"
          role="navigation"
          aria-label="Sidebar navigation"
        >
          <div className="ui labeled icon vertical small inverted menu">{menuItems}</div>
        </div>
      )}
      <div className="ui divider" />
      <IconPanel />
    </div>
  );
};

export default SideMenu;
