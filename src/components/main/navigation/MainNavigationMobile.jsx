'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import { matchPath } from 'react-router-dom';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
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

    const isActive = matchPath(this.props.url, {
      path: this.props.location.pathname
    });

    if (!isActive) {
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
        <SectionedDropdown 
          caption="More..."
          captionIcon="ellipsis horizontal caption" 
          className="right fluid" 
          triggerIcon=""
        >
          <MenuSection>
            { configMenuItems.map(menuItemGetter.bind(this, this.onClick, true)) }
          </MenuSection>
          <MenuSection>
            { menuItemGetter(logoutItem.onClick, true, logoutItem) }
          </MenuSection>
        </SectionedDropdown>

        <div className="separator"/>

        { secondaryMenuItems.map(menuItemGetter.bind(this, this.onClickSecondary, true)) }
        <IconPanel/>
      </div>
    );
  }
}

export default MainNavigationDecorator(MainNavigationMobile);
