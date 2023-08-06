import { useCallback } from 'react';

import IconPanel from 'components/main/navigation/IconPanel';
import { matchPath, Location, useNavigate, useLocation } from 'react-router-dom';
import { secondaryRoutes, parseMenuItems } from 'routes/Routes';
import { HOME_URL } from 'routes/Home';

import * as UI from 'types/ui';

interface SideMenuProps {
  previousLocation?: Location;
}

const SideMenu: React.FC<SideMenuProps> = ({ previousLocation }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClick: UI.RouteItemClickHandler = useCallback(
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
