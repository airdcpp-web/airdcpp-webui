import { Component } from 'react';
import { matchPath } from 'react-router-dom';
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

import History from 'utils/History';
import IconPanel from 'components/main/navigation/IconPanel';
import { Location } from 'history';
import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import Popup from 'components/semantic/Popup';

interface MainNavigationMobileProps {
  onClose: () => void;
  location: Location;
  visible: boolean;
}

class MainNavigationMobile extends Component<MainNavigationMobileProps> {
  c: HTMLDivElement;
  componentDidMount() {
    const settings = {
      context: '#mobile-layout',
      transition: 'overlay',
      mobileTransition: 'overlay',
      onHidden: this.props.onClose,
    };

    $(this.c).sidebar(settings);
  }

  componentDidUpdate(prevProps: MainNavigationMobileProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        $(this.c).sidebar('show');
      } else {
        $(this.c).sidebar('hide');
      }
    }
  }

  onClickSecondary: RouteItemClickHandler = (url, evt) => {
    evt.preventDefault();

    const isActive = matchPath(this.props.location.pathname, {
      path: url,
      //exact: url !== '/',
    });

    if (!isActive) {
      History.push(url);
    }

    this.onClick(url, evt);
  };

  onClick: RouteItemClickHandler = (url, evt) => {
    $(this.c).sidebar('hide');
  };

  render() {
    return (
      <Translation>
        {(t) => (
          <div
            ref={(c) => (this.c = c!)}
            id="mobile-menu"
            className="ui right vertical inverted sidebar menu"
          >
            {parseMenuItems(mainRoutes, this.onClick)}
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
                    {parseMenuItems(configRoutes, (path, event) => {
                      hide();
                      this.onClick(path, event);
                    })}
                    <div className="ui divider" />
                    {parseMenuItem(logoutItem)}
                  </div>
                </div>
              )}
            </Popup>
            <div className="separator" />

            {parseMenuItems(secondaryRoutes, this.onClickSecondary)}
            <IconPanel />
          </div>
        )}
      </Translation>
    );
  }
}

export default MainNavigationMobile;
