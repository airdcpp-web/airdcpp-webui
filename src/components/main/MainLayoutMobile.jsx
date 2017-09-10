import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import SiteHeader from './SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';
import MenuIcon from 'components/menu/MenuIcon';

import UrgencyUtils from 'utils/UrgencyUtils';
import History from 'utils/History';
import Button from 'components/semantic/Button';

import OverlayHandlerDecorator from './decorators/OverlayHandlerDecorator';
import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';

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

const HeaderContent = MainNavigationDecorator(createReactClass({
  displayName: 'HeaderContent',
  mixins: [ Reflux.ListenerMixin ],

  componentDidMount() {
    this.props.secondaryMenuItems.forEach(item => {
      if (item.unreadInfoStore) {
        this.listenTo(item.unreadInfoStore, _ => this.forceUpdate());
      }
    });
  },

  render() {
    const { secondaryMenuItems, onClickMenu, onClickBack, sidebar } = this.props;
		
    return (
      <div className="right">
        { sidebar && (
          <Button 
            className="item" 
            caption="Back" 
            icon="blue angle left"
            onClick={ onClickBack }
          />
        ) }
        <MenuIcon 
          urgencies={ UrgencyUtils.validateUrgencies(secondaryMenuItems.reduce(reduceMenuItemUrgency, {})) }
          onClick={ onClickMenu }
          className="item"
        />
      </div>
    );
  },
}));

class MainLayoutMobile extends React.Component {
  state = {
    menuVisible: false,
  };

  onClickMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  onClickBack = () => {
    History.replaceSidebarData(this.props.location, { close: true });
  };

  render() {
    const { children, sidebar } = this.props;
		
    return (
      <div className={this.props.className} id="mobile-layout">
        { this.state.menuVisible && (
          <MainNavigation
            location={ this.props.location }
            onClose={ this.onClickMenu }
          />
        ) }
        <div className="pusher sidebar-context" id="mobile-layout-inner">
          <SiteHeader 
            content={
              <HeaderContent
                onClickMenu={ this.onClickMenu }
                onClickBack={ this.onClickBack }
                sidebar={ sidebar }
              />
            }
          />
          { sidebar }
          <div className="ui site-content pusher">
            { children }
          </div>
        </div>
      </div>
    );
  }
}

export default OverlayHandlerDecorator(MainLayoutMobile);