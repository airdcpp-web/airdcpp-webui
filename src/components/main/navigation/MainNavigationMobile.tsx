import { matchPath, useLocation, useNavigate } from 'react-router';
import {
  configRoutes,
  mainRoutes,
  secondaryRoutes,
  logoutItem,
  parseMenuItems,
  parseMenuItem,
  RouteItemClickHandler,
} from 'routes/Routes';

import DropdownCaption from 'components/semantic/DropdownCaption';

import IconPanel from 'components/main/navigation/IconPanel';
import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import Popup from 'components/semantic/Popup';
import { useEffect, useRef } from 'react';
import { useSession } from 'context/SessionContext';

interface MainNavigationMobileProps {
  onClose: () => void;
  visible: boolean;
}

const MainNavigationMobile: React.FC<MainNavigationMobileProps> = ({
  onClose,
  visible,
}) => {
  const login = useSession();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const settings = {
      context: '#mobile-layout',
      transition: 'overlay',
      mobileTransition: 'overlay',
      onHidden: onClose,
    };

    $(ref.current!).sidebar(settings);
  }, []);

  useEffect(() => {
    if (visible) {
      $(ref.current!).sidebar('show');
    } else {
      $(ref.current!).sidebar('hide');
    }
  }, [visible]);

  const navigate = useNavigate();
  const location = useLocation();

  const onClick: RouteItemClickHandler = (url, evt) => {
    $(ref.current!).sidebar('hide');
  };

  const onClickSecondary: RouteItemClickHandler = (url, evt) => {
    evt.preventDefault();

    // const { location, history } = this.props;
    const isActive = matchPath(url, location.pathname);

    if (!isActive) {
      navigate(url);
    }

    onClick(url, evt);
  };

  return (
    <Translation>
      {(t) => (
        <div
          ref={ref}
          id="mobile-menu"
          className="ui right vertical inverted sidebar menu"
        >
          {parseMenuItems(mainRoutes, login, onClick)}
          <Popup
            // Use Popup instead of Dropdown to allow menu to escape the sidebar without disabling vectical scrolling
            // https://github.com/Semantic-Org/Semantic-UI/issues/1410
            trigger={
              <DropdownCaption icon="ellipsis horizontal caption">
                {translate('More...', t, UI.SubNamespaces.NAVIGATION)}
              </DropdownCaption>
            }
            triggerClassName="item"
            className="inverted"
            position="bottom left"
            settings={{
              distanceAway: -20,
            }}
          >
            {(hide) => (
              <div className="ui dropdown item right fluid active visible">
                <div className="ui menu transition visible">
                  {parseMenuItems(configRoutes, login, (path, event) => {
                    hide();
                    onClick(path, event);
                  })}
                  <div className="ui divider" />
                  {parseMenuItem(logoutItem)}
                </div>
              </div>
            )}
          </Popup>
          <div className="separator" />

          {parseMenuItems(secondaryRoutes, login, onClickSecondary)}
          <IconPanel />
        </div>
      )}
    </Translation>
  );
};

export default MainNavigationMobile;
