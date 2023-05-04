import { useCallback } from 'react';

import IconPanel from 'components/main/navigation/IconPanel';
import { matchPath, Location, useNavigate } from 'react-router-dom';
import {
  secondaryRoutes,
  parseMenuItems,
  RouteItemClickHandler,
  HOME_URL,
} from 'routes/Routes';

interface SideMenuProps {
  location: Location;
  previousLocation?: Location;
}

const SideMenu: React.FC<SideMenuProps> = ({ location, previousLocation }) => {
  const navigate = useNavigate();

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
    [location]
  );

  const menuItems = parseMenuItems(secondaryRoutes, onClick);
  return (
    <div id="side-menu">
      {menuItems.length > 0 && (
        <div className="content navigation">
          <div className="ui labeled icon vertical small inverted menu">{menuItems}</div>
        </div>
      )}
      <div className="ui divider" />
      <IconPanel />
    </div>
  );
};

export default SideMenu;
