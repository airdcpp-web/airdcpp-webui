import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';


class ShareProfileSelector extends React.Component {
  static propTypes = {
    /**
		 * Callback after selecting a profile
		 */
    onProfileChanged: PropTypes.func.isRequired,
  };

  onClick = (profile) => {
    this.props.onProfileChanged(profile.id);
  };

  getDropdownItem = (profile) => {
    return (
      <MenuItemLink 
        key={ profile.id } 
        onClick={ () => this.props.onProfileChanged(profile.id) }
      >
        { profile.str }
      </MenuItemLink>
    );
  };

  render() {
    return (
      <Dropdown className="profile top right pointing" caption="Browse own share..." triggerIcon="">
        { this.props.profiles.map(this.getDropdownItem) }
      </Dropdown>
    );
  }
}

export default ShareProfileDecorator(ShareProfileSelector, false);