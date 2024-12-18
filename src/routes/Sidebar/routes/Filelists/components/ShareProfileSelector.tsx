import { Component } from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from 'decorators/ShareProfileDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { formatProfileNameWithSize } from 'utils/ShareProfileUtils';

interface ShareProfileSelectorProps {
  // Callback after selecting a profile
  onProfileChanged: (profileId: number) => void;

  sessionT: UI.ModuleTranslator;
}

class ShareProfileSelector extends Component<
  ShareProfileSelectorProps & ShareProfileDecoratorChildProps
> {
  onClick = (profile: API.ShareProfile) => {
    this.props.onProfileChanged(profile.id);
  };

  getDropdownItem = (profile: API.ShareProfile) => {
    return (
      <MenuItemLink
        key={profile.id}
        onClick={() => this.props.onProfileChanged(profile.id)}
      >
        {formatProfileNameWithSize(profile, this.props.sessionT.plainT)}
      </MenuItemLink>
    );
  };

  render() {
    const { sessionT, profiles } = this.props;
    return (
      <Dropdown
        className="profile top right pointing"
        caption={sessionT.translate('Browse own share...')}
        triggerIcon=""
      >
        {profiles.map(this.getDropdownItem)}
      </Dropdown>
    );
  }
}

export default ShareProfileDecorator(ShareProfileSelector, false);
