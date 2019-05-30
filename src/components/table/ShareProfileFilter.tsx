//import PropTypes from 'prop-types';
import React, { useState } from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuItemLink from 'components/semantic/MenuItemLink';

import ShareProfileDecorator, { ShareProfileDecoratorChildProps } from 'decorators/ShareProfileDecorator';
import TableFilterDecorator, { 
  TableFilterDecoratorChildProps, TableFilterDecoratorProps 
} from 'decorators/TableFilterDecorator';

import * as API from 'types/api';
import { translate } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import IconConstants from 'constants/IconConstants';


interface ShareProfileItem {
  id: null | number;
  str: string;
}

export interface ShareProfileFilterProps {

}

type Props = 
  ShareProfileFilterProps & TableFilterDecoratorChildProps & 
  ShareProfileDecoratorChildProps;


const getDropdownItem = (
  profile: ShareProfileItem, 
  onClick: (p: ShareProfileItem) => void, 
  selectedProfile: ShareProfileItem
) => {
  return (
    <MenuItemLink 
      key={ profile.id as number }
      active={ selectedProfile.id === profile.id } 
      onClick={ () => onClick(profile) }
    >
      { profile.str }
    </MenuItemLink>
  );
};

const ShareProfileFilter = React.memo<Props>(props => {
  const { t } = useTranslation();

  const defaultItem: ShareProfileItem = { 
    str: translate('All profiles', t, 'table.filter'), 
    id: null 
  };

  const [ selectedProfile, setSelectedProfile ] = useState<ShareProfileItem>(defaultItem);

  const onClick = (profile: API.ShareProfile) => {
    props.onFilterUpdated(profile.id);
    setSelectedProfile(profile);
  };

  return (
    <SectionedDropdown 
      className="top right pointing" 
      caption={ selectedProfile.str } 
      triggerIcon="filter" 
      button={ true }
    >
      <MenuSection 
        caption={ translate('Filter by profile', t, 'table.filter') } 
        icon={ IconConstants.FILTER }
      >
        { [ defaultItem, ...props.profiles ].map(p => getDropdownItem(p, onClick, selectedProfile)) }
      </MenuSection>
    </SectionedDropdown>
  );
});

export default ShareProfileDecorator<ShareProfileFilterProps & TableFilterDecoratorProps>(
  TableFilterDecorator<ShareProfileFilterProps & ShareProfileDecoratorChildProps>(
    ShareProfileFilter, 
    'profiles'
  ), 
  false
);