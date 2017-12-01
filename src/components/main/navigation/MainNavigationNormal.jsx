'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import Dropdown from 'components/semantic/Dropdown';
import DropdownSection from 'components/semantic/DropdownSection';

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

        <Dropdown className="top right">
          <DropdownSection>
            { configMenuItems.map(item => menuItemGetter(null, true, item)) }
          </DropdownSection>
          <DropdownSection>
            { menuItemGetter(logoutItem.onClick, true, logoutItem) }
          </DropdownSection>
        </Dropdown>
      </div>
    );
  }
}

export default MainNavigationDecorator(MainNavigationNormal);
