'use strict';

import PropTypes from 'prop-types';

import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownSection from 'components/semantic/DropdownSection';
import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';

import History from 'utils/History';
import IconPanel from './IconPanel';


class MainNavigationMobile extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const settings = {
      context: '#mobile-layout',
      transition: 'overlay',
      mobileTransition: 'overlay',
      onHidden: this.props.onClose,
    };

    $(this.c).sidebar(settings).sidebar('show');
  }

  onClickSecondary = (url, evt) => {
    evt.preventDefault();

    if (!this.context.router.isActive(url)) {
      History.pushSidebar(this.props.location, url);
    }

    this.onClick(url, evt);
  };

  onClick = (url, evt) => {
    $(this.c).sidebar('hide');
  };

  render() {
    const { configMenuItems, mainMenuItems, secondaryMenuItems, logoutItem, menuItemGetter } = this.props;
    return (
      <div 
        ref={ c => this.c = c }
        id="mobile-menu" 
        className="ui right vertical inverted sidebar menu"
      >
        { mainMenuItems.map(menuItemGetter.bind(this, this.onClick, true)) }
        <Dropdown 
          caption="More..."
          captionIcon="ellipsis horizontal caption" 
          className="right fluid" 
          triggerIcon=""
        >
          <DropdownSection>
            { configMenuItems.map(menuItemGetter.bind(this, this.onClick, true)) }
          </DropdownSection>
          <DropdownSection>
            { menuItemGetter(logoutItem.onClick, true, logoutItem) }
          </DropdownSection>
        </Dropdown>

        <div className="separator"/>

        { secondaryMenuItems.map(menuItemGetter.bind(this, this.onClickSecondary, true)) }
        <IconPanel/>
      </div>
    );
  }
}

export default MainNavigationDecorator(MainNavigationMobile);
