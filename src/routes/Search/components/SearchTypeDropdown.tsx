import React, { useState } from 'react';

import * as API from 'types/api';
//import * as UI from 'types/ui';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import SearchConstants from 'constants/SearchConstants';
import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import FileIcon from 'components/icon/FileIcon';
import Icon from 'components/semantic/Icon';


interface SearchTypeDropdownProps {

}

interface DataProps {
  searchTypes: API.SearchType[];
}


const searchTypeToFileType = (searchType: API.SearchType): API.FileItemType => {
  if (searchType.id === 'directory') {
    return {
      id: 'directory',
      str: '',
      files: 0,
      directories: 0,
    };
  }

  return {
    id: 'file',
    str: '',
    content_type: searchType.id as API.FileContentType,
  };
};


interface SearchTypeIconProps {
  type: API.SearchType | null;
  size?: string;
}

const SearchTypeIcon: React.FC<SearchTypeIconProps> = ({ type, size = 'large' }) => {
  if (!type) {
    return <Icon icon={ 'star' } size={ size }/>;
  }

  return <FileIcon typeInfo={ searchTypeToFileType(type) } size={ size }/>;
};

type Props = SearchTypeDropdownProps & DataProviderDecoratorChildProps & DataProps;

const SearchTypeDropdown: React.FC<Props> = ({ searchTypes }) => {
  const [ selectedItem, setSelectedItem ] = useState<API.SearchType | null>(null);
  return (
    <Dropdown
      className="fluid selection"
      caption={ (
        <>
          <SearchTypeIcon type={ selectedItem } size=""/>
          { selectedItem ? selectedItem.str : 'Any' }
        </>
      ) }
    >
      <MenuItemLink 
        onClick={ () => setSelectedItem(null) }
        icon={ <SearchTypeIcon type={ null }/> }
        active={ !selectedItem }
      >
        { 'Any' }
      </MenuItemLink>

      { searchTypes.map(type => (
        <MenuItemLink 
          key={ type.id }
          onClick={ () => setSelectedItem(type) }
          icon={ <FileIcon typeInfo={ searchTypeToFileType(type) }/> }
          active={ !!selectedItem && selectedItem.id === type.id }
        >
          { type.str }
        </MenuItemLink>
      )) }
    </Dropdown>
  );
};

const SearchTypeDropdownDecorated = DataProviderDecorator<SearchTypeDropdownProps, DataProps>(
  SearchTypeDropdown,
  {
    urls: {
      searchTypes: SearchConstants.SEARCH_TYPES_URL
    }
  }
);

export { SearchTypeDropdownDecorated as SearchTypeDropdown };
