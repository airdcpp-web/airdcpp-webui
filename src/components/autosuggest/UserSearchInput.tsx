import React from 'react';

import UserConstants from 'constants/UserConstants';

import RemoteSuggestField, { RemoteSuggestFieldProps } from './RemoteSuggestField';
import OfflineHubMessageDecorator, { OfflineHubMessageDecoratorProps } from 'decorators/OfflineHubMessageDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';


export interface UserSearchInputProps extends 
  Pick<RemoteSuggestFieldProps<API.HintedUser>, 'submitHandler'>, 
  Pick<OfflineHubMessageDecoratorProps, 'offlineMessage'> {
    
}

const UserSearchInput: React.FC<UserSearchInputProps> = ({ offlineMessage, submitHandler }) => {
  const { t } = useTranslation();
  return (
    <OfflineHubMessageDecorator 
      offlineMessage={ offlineMessage }
    >
      <RemoteSuggestField
        placeholder={ translate('Enter nick...', t, UI.Modules.COMMON) }
        submitHandler={ submitHandler }
        valueField="nick"
        descriptionField="hub_name"
        url={ UserConstants.SEARCH_NICKS_URL }
      />
    </OfflineHubMessageDecorator>
  );
};

export default UserSearchInput;
