import React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import FileIcon from 'components/icon/FileIcon';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';


const searchTypeToFileItem = (searchType: UI.SearchTypeItem): API.FileItemType => {
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
  type: UI.SearchTypeItem;
  size?: string;
}

export const SearchTypeIcon: React.FC<SearchTypeIconProps> = ({ type, size = 'large' }) => {
  if (!type.id) {
    return (
      <Icon 
        icon={ IconConstants.ANY } 
        size={ size }
      />
    );
  }

  return (
    <FileIcon 
      typeInfo={ searchTypeToFileItem(type) } 
      size={ size }
    />
  );
};
