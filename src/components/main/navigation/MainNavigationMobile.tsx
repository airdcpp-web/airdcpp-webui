'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import { matchPath } from 'react-router-dom';
import { 
  configRoutes, mainRoutes, secondaryRoutes, logoutItem, 
  parseMenuItems, parseMenuItem, RouteItemClickHandler 
} from 'routes/Routes';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import History from 'utils/History';
import IconPanel from 'components/main/navigation/IconPanel';
import { Location } from 'history';


interface MainNavigationMobileProps {
  onClose: () => void;
  location: Location;
}

class MainNavigationMobile extends React.Component<MainNavigationMobileProps> {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  c: HTMLDivElement;
  componentDidMount() {
    const settings = {
      context: '#mobile-layout',
      transition: 'overlay',
      mobileTransition: 'overlay',
      onHidden: this.props.onClose,
    };

    $(this.c).sidebar(settings).sidebar('show');
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
  }

  onClick: RouteItemClickHandler = (url, evt) => {
    $(this.c).sidebar('hide');
  }

  render() {
    return (
      <div 
        ref={ c => this.c = c! }
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
