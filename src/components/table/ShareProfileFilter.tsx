import { memo, useState } from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuItemLink from 'components/semantic/MenuItemLink';

import ShareProfileDecorator, {
  ShareProfileDecoratorChildProps,
} from 'decorators/ShareProfileDecorator';
import TableFilterDecorator, {
  TableFilterDecoratorChildProps,
  TableFilterDecoratorProps,
} from 'decorators/TableFilterDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import IconConstants from 'constants/IconConstants';
import { formatProfileNameWithSize } from 'utils/ShareProfileUtils';

export interface ShareProfileFilterProps {}

type Props = ShareProfileFilterProps &
  TableFilterDecoratorChildProps &
  ShareProfileDecoratorChildProps;

const formatItemName = (profile: API.ShareProfile | null, t: UI.TranslateF) =>
  profile
    ? formatProfileNameWithSize(profile, t)
    : translate('All profiles', t, 'table.filter');

const getDropdownItem = (
  profile: API.ShareProfile | null,
  onClick: (p: API.ShareProfile | null) => void,
  selectedProfile: API.ShareProfile | null,
  t: UI.TranslateF,
) => {
  return (
    <MenuItemLink
      key={profile ? profile.id : 'all'}
      active={selectedProfile === profile}
      onClick={() => onClick(profile)}
    >
      {formatItemName(profile, t)}
    </MenuItemLink>
  );
};

const ShareProfileFilter = memo<Props>(function ShareProfileFilter(props) {
  const { t } = useTranslation();
  const [selectedProfile, setSelectedProfile] = useState<API.ShareProfile | null>(null);

  const handleSelectItem = (profile: API.ShareProfile | null) => {
    props.onFilterUpdated(profile ? profile.id : null);
    setSelectedProfile(profile);
  };

  return (
    <SectionedDropdown
      className="top right pointing"
      caption={formatItemName(selectedProfile, t)}
      triggerIcon="filter"
      button={true}
    >
      <MenuSection
        caption={translate('Filter by profile', t, 'table.filter')}
        icon={IconConstants.FILTER}
      >
        {[null, ...props.profiles].map((p) =>
          getDropdownItem(p, handleSelectItem, selectedProfile, t),
        )}
      </MenuSection>
    </SectionedDropdown>
  );
});

export default ShareProfileDecorator<ShareProfileFilterProps & TableFilterDecoratorProps>(
  TableFilterDecorator<ShareProfileFilterProps & ShareProfileDecoratorChildProps>(
    ShareProfileFilter,
    'profiles',
  ),
  false,
);
