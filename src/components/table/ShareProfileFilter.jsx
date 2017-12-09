import PropTypes from 'prop-types';
import React from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import { MenuItemLink } from 'components/semantic/MenuItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import TableFilterDecorator from 'decorators/TableFilterDecorator';

const defaultItem = { str: 'All profiles', id: null };

class ShareProfileFilter extends React.Component {
  static propTypes = {
    /**
		 * Callback after selecting a profile
		 */
    onFilterUpdated: PropTypes.func,
  };

  state = {
    selectedProfile: defaultItem,
  };

  onClick = (profile) => {
    this.props.onFilterUpdated(profile.id);
    this.setState({ 
      selectedProfile: profile 
    });
  };

  getDropdownItem = (profile) => {
    return (
      <MenuItemLink 
        key={ profile.id }
        active={ this.state.selectedProfile ? this.state.selectedProfile.id === profile.id : false } 
        onClick={ () => this.onClick(profile) }
      >
        { profile.str }
      </MenuItemLink>
    );
  };

  render() {
    return (
      <SectionedDropdown 
        className="top right pointing" 
        caption={ this.state.selectedProfile.str } 
        triggerIcon="filter" 
        button={ true }
      >
        <MenuSection caption="Filter by profile" icon="filter">
          { [ defaultItem, ...this.props.profiles ].map(this.getDropdownItem) }
        </MenuSection>
      </SectionedDropdown>
    );
  }
}

export default ShareProfileDecorator(TableFilterDecorator(ShareProfileFilter, 'profiles'), false);