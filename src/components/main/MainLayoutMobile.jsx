import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import SiteHeader from './SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';
import MenuIcon from 'components/menu/MenuIcon';

import UrgencyUtils from 'utils/UrgencyUtils';

import SidebarHandlerDecorator from './decorators/SidebarHandlerDecorator';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import 'mobile.css';


const reduceMenuItemUrgency = (map, menuItem) => {
  if (!menuItem.unreadInfoStore) {
    return map;
  }

  const urgencies = menuItem.unreadInfoStore.getTotalUrgencies();
  if (!urgencies) {
    return map;
  }

  const max = UrgencyUtils.maxUrgency(urgencies);
  if (max) {
    UrgencyUtils.appendToMap(map, max);
  }

  return map;
};

const HeaderContent = createReactClass({
  displayName: 'HeaderContent',
  mixins: [ Reflux.ListenerMixin ],

  componentDidMount() {
    secondaryRoutes.forEach(item => {
      if (item.unreadInfoStore) {
        this.listenTo(item.unreadInfoStore, _ => this.forceUpdate());
      }
    });
  },

  render() {
    const { onClickMenu } = this.props;
		
    return (
      <div className="right">
        <MenuIcon 
          urgencies={ UrgencyUtils.validateUrgencies(secondaryRoutes.reduce(reduceMenuItemUrgency, {})) }
          onClick={ onClickMenu }
          className="item"
        />
      </div>
    );
  },
});

class MainLayoutMobile extends React.Component {
  state = {
    menuVisible: false,
  };

  onClickMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

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
          <SiteHeader 
            content={
              <HeaderContent
                onClickMenu={ this.onClickMenu }
                location={ location }
              />
            }
          />
          <div className="site-content">
            { parseRoutes([ ...mainRoutes, ...secondaryRoutes, ...configRoutes ]) }
          </div>
        </div>
      </div>
    );
  }
}

export default SidebarHandlerDecorator(MainLayoutMobile);