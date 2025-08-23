import { matchPath, useLocation, useNavigate } from 'react-router';
import {
  parseMenuItems,
  parseMenuItem,
  RouteItemClickHandler,
  getLogoutItem,
} from '@/routes/Routes';

import DropdownCaption from '@/components/semantic/DropdownCaption';

import IconPanel from '@/components/main/navigation/IconPanel';
import { useTranslation } from 'react-i18next';
import { translate } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';
import Popup from '@/components/semantic/Popup';
import { useEffect, useRef } from 'react';
import { useSession } from '@/context/AppStoreContext';
import { useSocket } from '@/context/SocketContext';
import { MainLayoutProps } from '../AuthenticatedApp';
import { useAppStore } from '@/context/AppStoreContext';

interface MainNavigationMobileProps
  extends Pick<MainLayoutProps, 'primaryRoutes' | 'secondaryRoutes' | 'sidebarRoutes'> {
  onClose: () => void;
  visible: boolean;
}

const MainNavigationMobile: React.FC<MainNavigationMobileProps> = ({
  primaryRoutes,
  secondaryRoutes,
  sidebarRoutes,

  onClose,
  visible,
}) => {
  const login = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const appStore = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    const settings: SemanticUI.SidebarSettings = {
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

  const onClickSidebar: RouteItemClickHandler = (url, evt) => {
    evt.preventDefault();
    const isActive = matchPath(url, location.pathname);

    if (!isActive) {
      navigate(url);
    }

    onClick(url, evt);
  };

  const menuItemProps = { role: 'menuitem' };

  return (
    <nav
      ref={ref}
      id="mobile-menu"
      className="ui right vertical inverted sidebar menu"
      aria-label={visible ? 'Main navigation' : undefined}
      aria-hidden={!visible}
      inert={!visible}
    >
      {parseMenuItems(primaryRoutes, login, {
        onClick,
        props: menuItemProps,
      })}
      <Popup
        // Use Popup instead of Dropdown to allow menu to escape the sidebar without disabling vectical scrolling
        // https://github.com/Semantic-Org/Semantic-UI/issues/1410
        trigger={
          <DropdownCaption icon="ellipsis horizontal caption">
            {translate('More...', t, UI.SubNamespaces.NAVIGATION)}
          </DropdownCaption>
        }
        triggerClassName="item"
        className="inverted basic"
        position="bottom left"
        settings={{
          distanceAway: -20,
        }}
        triggerProps={{
          'aria-haspopup': 'menu',
        }}
      >
        {(hide) => {
          const onClickSecondary: RouteItemClickHandler = (path, event) => {
            hide();
            onClick(path, event);
          };

          return (
            <div className="ui dropdown item right fluid active visible">
              <div
                className="ui menu transition visible"
                role="menu"
                aria-label="More options"
              >
                {parseMenuItems(secondaryRoutes, login, {
                  onClick: onClickSecondary,
                  props: menuItemProps,
                })}
                <div className="ui divider" />
                {parseMenuItem(getLogoutItem(socket, appStore), {
                  props: menuItemProps,
                })}
              </div>
            </div>
          );
        }}
      </Popup>
      <div className="separator" />

      {parseMenuItems(sidebarRoutes, login, {
        onClick: onClickSidebar,
        props: menuItemProps,
      })}
      <IconPanel />
    </nav>
  );
};

export default MainNavigationMobile;
