//import PropTypes from 'prop-types';
import React from 'react';

import SocketService from 'services/SocketService';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuItemLink from 'components/semantic/MenuItemLink';

import * as API from 'types/api';
import * as UI from 'types/ui';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import ShareConstants from 'constants/ShareConstants';
import NotificationActions from 'actions/NotificationActions';
import IconConstants from 'constants/IconConstants';
import FileIcon from 'components/icon/FileIcon';

import { translate, toI18nKey } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';


export interface TempShareDropdownProps {
  handleUpload: () => void;
  style?: React.CSSProperties;
}

interface DataProps {
  files: API.TempShareItem[];
}

type Props = TempShareDropdownProps & DataProps &
  DataProviderDecoratorChildProps;


const getDropdownItem = (
  file: API.TempShareItem, 
  onClick: (p: API.TempShareItem) => void
) => {
  return (
    <MenuItemLink 
      key={ file.id }
      onClick={ () => onClick(file) }
      icon={ <FileIcon typeInfo={ file.type }/> }
    >
      { file.name }
    </MenuItemLink>
  );
};

const TempShareDropdown = React.memo<Props>(({ files, handleUpload, style }) => {
  const { t } = useTranslation();

  const onClickFile = (file: API.TempShareItem) => {
    SocketService.delete(`${ShareConstants.TEMP_SHARES_URL}/${file.id}`)
      .then(res => {
        NotificationActions.success({
          title: t(toI18nKey('fileNoLongerShared', UI.Modules.COMMON), {
            defaultValue: 'File {{file.name}} is no longer shared',
            replace: {
              file
            }
          })
        });
      })
      .catch(e => {
        NotificationActions.apiError('Failed to remove shared item', e);
      });
  };

  return (
    <SectionedDropdown 
      className="top left pointing" 
      triggerIcon="plus" 
      button={ true }
      contextElement=".message-view"
      dropDownElementProps={{
        style: {
          width: '38px',
          ...style
        }
      }}
    >
      <MenuItemLink 
        onClick={ handleUpload }
        icon={ IconConstants.UPLOAD }
      >
        { translate('Send file', t, UI.Modules.COMMON) }
      </MenuItemLink>
      <MenuSection 
        caption={ translate('Remove shared file', t, UI.Modules.COMMON) } 
        icon="file"
      >
        { files.map(p => getDropdownItem(p, onClickFile)) }
      </MenuSection>
    </SectionedDropdown>
  );
});

export default DataProviderDecorator<TempShareDropdownProps, DataProps>(
  TempShareDropdown,
  {
    urls: {
      files: ShareConstants.TEMP_SHARES_URL,
    },  
    onSocketConnected: (addSocketListener, { refetchData }) => {
      addSocketListener(ShareConstants.MODULE_URL, ShareConstants.TEMP_ITEM_ADDED, () => refetchData());
      addSocketListener(ShareConstants.MODULE_URL, ShareConstants.TEMP_ITEM_REMOVED, () => refetchData());
    },
    loaderText: null,
  }
);