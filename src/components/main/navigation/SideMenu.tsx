import { Component } from 'react';

import IconPanel from 'components/main/navigation/IconPanel';
import { matchPath } from 'react-router-dom';
import {
  secondaryRoutes,
  parseMenuItems,
  RouteItemClickHandler,
  HOME_URL,
} from 'routes/Routes';
import { Location, History } from 'history';

interface SideMenuProps {
  location: Location;
  previousLocation?: Location;
  history: History;
}

class SideMenu extends Component<SideMenuProps> {
  onClick: RouteItemClickHandler = (url, evt) => {
    evt.preventDefault();

    const { location, previousLocation, history } = this.props;
    const isActive = matchPath(location.pathname, {
      path: url,
    });

    if (isActive) {
      if (!!previousLocation) {
        history.replace({
          pathname: previousLocation.pathname,
          state: previousLocation.state,
        });
      } else {
        history.replace(HOME_URL);
      }
    } else {
      history.push(url);
    }
  };

  shouldComponentUpdate(prevProps: SideMenuProps) {
    return (
      prevProps.location !== this.props.location ||
      prevProps.previousLocation !== this.props.previousLocation
    );
  }

  render() {
    const menuItems = parseMenuItems(secondaryRoutes, this.onClick);
    return (
      <div id="side-menu">
        {menuItems.length > 0 && (
          <div className="content navigation">
            <div className="ui labeled icon vertical small inverted menu">
              {menuItems}
            </div>
          </div>
        )}
        <div className="ui divider" />
        <IconPanel />
      </div>
    );
  }
}

export default SideMenu;
