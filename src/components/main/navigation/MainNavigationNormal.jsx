'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';


class MainNavigationNormal extends React.Component {
  static propTypes = {
    mainMenuItems: PropTypes.array.isRequired,
    configMenuItems: PropTypes.array.isRequired,
    logoutItem: PropTypes.object.isRequired,
  };

  render() {
    const { configMenuItems, mainMenuItems, logoutItem, menuItemGetter } = this.props;
    return (
      <div className="item right">
        { mainMenuItems.map(item => menuItemGetter(null, false, item)) }

        <SectionedDropdown className="top right">
          <MenuSection>
            { configMenuItems.map(item => menuItemGetter(null, true, item)) }
          </MenuSection>
          <MenuSection>
            { menuItemGetter(logoutItem.onClick, true, logoutItem) }
          </MenuSection>
        </SectionedDropdown>
      </div>
    );
  }
}

export default MainNavigationDecorator(MainNavigationNormal);
