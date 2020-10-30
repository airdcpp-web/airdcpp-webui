//import PropTypes from 'prop-types';
import { Component } from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface ShareProfileSelectorProps {
  onProfileChanged: (profileId: number) => void;
  sessionT: UI.ModuleTranslator;
}

class ShareProfileSelector extends Component<ShareProfileSelectorProps & ShareProfileDecoratorChildProps> {
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
    const { sessionT } = this.props;
    return (
      <Dropdown 
        className="profile top right pointing" 
        caption={ sessionT.translate('Browse own share...') }
        triggerIcon=""
      >
        { this.props.profiles.map(this.getDropdownItem) }
      </Dropdown>
    );
  }
}

export default ShareProfileDecorator(ShareProfileSelector, false);