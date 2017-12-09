'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import { matchPath } from 'react-router-dom';
import { configRoutes, mainRoutes, secondaryRoutes, logoutItem, parseMenuItems, parseMenuItem } from 'routes/Routes';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

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

    const isActive = matchPath(this.props.location.pathname, {
      path: url,
      exact: url !== '/',
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
    return (
      <div 
        ref={ c => this.c = c }
        id="mobile-menu" 
        className="ui right vertical inverted sidebar menu"
      >
        { parseMenuItems(mainRoutes, this.onClick) }
        <SectionedDropdown 
          caption="More..."
          captionIcon="ellipsis horizontal caption" 
          className="right fluid" 
          triggerIcon=""
        >
          <MenuSection>
            { parseMenuItems(configRoutes, this.onClick) }
          </MenuSection>
          <MenuSection>
            { parseMenuItem(logoutItem) }
          </MenuSection>
        </SectionedDropdown>

        <div className="separator"/>

        { parseMenuItems(secondaryRoutes, this.onClickSecondary) }
        <IconPanel/>
      </div>
    );
  }
}

export default MainNavigationMobile;
