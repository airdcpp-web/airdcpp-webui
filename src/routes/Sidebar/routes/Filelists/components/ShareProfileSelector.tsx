//import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';


interface ShareProfileSelectorProps {
  onProfileChanged: (profileId: number) => void;
}

class ShareProfileSelector extends React.Component<ShareProfileSelectorProps & ShareProfileDecoratorChildProps> {
  /*static propTypes = {
    // Callback after selecting a profile
    onProfileChanged: PropTypes.func.isRequired,
  };*/

  onClick = (profile: API.ShareProfile) => {
    this.props.onProfileChanged(profile.id);
  }

  getDropdownItem = (profile: API.ShareProfile) => {
    return (
      <MenuItemLink 
        key={ profile.id } 
        onClick={ () => this.props.onProfileChanged(profile.id) }
      >
        { profile.str }
      </MenuItemLink>
    );
  }

  render() {
    return (
      <Dropdown 
        className="profile top right pointing" 
        caption="Browse own share..." 
        triggerIcon=""
      >
        { this.props.profiles.map(this.getDropdownItem) }
      </Dropdown>
    );
  }
}

export default ShareProfileDecorator(ShareProfileSelector, false);