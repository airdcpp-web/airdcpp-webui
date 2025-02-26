import Dropdown from '@/components/semantic/Dropdown';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from '@/decorators/ShareProfileDecorator';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { formatProfileNameWithSize } from '@/utils/ShareProfileUtils';
import { useFormatter } from '@/context/FormatterContext';

interface ShareProfileSelectorProps {
  // Callback after selecting a profile
  onProfileChanged: (profileId: number) => void;

  sessionT: UI.ModuleTranslator;
}

const ShareProfileSelector: React.FC<
  ShareProfileSelectorProps & ShareProfileDecoratorChildProps
> = ({ sessionT, profiles, onProfileChanged }) => {
  const formatter = useFormatter();

  const getDropdownItem = (profile: API.ShareProfile) => {
    return (
      <MenuItemLink key={profile.id} onClick={() => onProfileChanged(profile.id)}>
        {formatProfileNameWithSize(profile, formatter)}
      </MenuItemLink>
    );
  };

  return (
    <Dropdown
      className="profile top right pointing"
      caption={sessionT.translate('Browse own share...')}
      triggerIcon=""
    >
      {profiles.map(getDropdownItem)}
    </Dropdown>
  );
};

export default ShareProfileDecorator(ShareProfileSelector, false);
