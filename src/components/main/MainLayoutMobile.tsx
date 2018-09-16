import React from 'react';
import createReactClass from 'create-react-class';

//@ts-ignore
import Reflux from 'reflux';

import SiteHeader from 'components/main/SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';
import MenuIcon from 'components/menu/MenuIcon';

import { appendToMap, maxUrgency, validateUrgencies } from 'utils/UrgencyUtils';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes, RouteItem } from 'routes/Routes';

import 'mobile.css';
import { Location } from 'history';

import * as UI from 'types/ui';


const reduceMenuItemUrgency = (urgencyCountMap: UI.UrgencyCountMap, menuItem: RouteItem) => {
  if (!menuItem.unreadInfoStore) {
    return urgencyCountMap;
  }

  const urgencies = menuItem.unreadInfoStore.getTotalUrgencies();
  if (!urgencies) {
    return urgencyCountMap;
  }

  const max = maxUrgency(urgencies);
  if (max) {
    appendToMap(urgencyCountMap, max);
  }

  return urgencyCountMap;
};

interface HeaderContentProps {
  onClickMenu: () => void;
}

const HeaderContent = createReactClass<HeaderContentProps, {}>({
  displayName: 'HeaderContent',
  mixins: [ Reflux.ListenerMixin ],

  componentDidMount() {
    secondaryRoutes.forEach(item => {
      if (item.unreadInfoStore) {
        this.listenTo(item.unreadInfoStore, () => this.forceUpdate());
      }
    });
  },

  render() {
    const { onClickMenu } = this.props;
    return (
      <div className="right">
        <MenuIcon 
          urgencies={ validateUrgencies(secondaryRoutes.reduce(reduceMenuItemUrgency, {})) }
          onClick={ onClickMenu }
          className="item"
        />
      </div>
    );
  },
});

interface MainLayoutMobileProps {
  className?: string;
  location: Location;
}

class MainLayoutMobile extends React.Component<MainLayoutMobileProps> {
  state = {
    menuVisible: false,
  };

  onClickMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  render() {
    const { className, location } = this.props;
    return (
      <div className={ className } id="mobile-layout">
        { this.state.menuVisible && (
          <MainNavigation
            location={ location }
            onClose={ this.onClickMenu }
          />
        ) }
        <div className="pusher" id="mobile-layout-inner">
          <SiteHeader>
            <HeaderContent
              onClickMenu={ this.onClickMenu }
            />
          </SiteHeader>
          <div className="site-content">
            { parseRoutes([ ...mainRoutes, ...secondaryRoutes, ...configRoutes ]) }
          </div>
        </div>
      </div>
    );
  }
}

export default MainLayoutMobile;