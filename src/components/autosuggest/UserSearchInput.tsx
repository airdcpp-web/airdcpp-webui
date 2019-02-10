import React from 'react';

import UserConstants from 'constants/UserConstants';

import RemoteSuggestField, { RemoteSuggestFieldProps } from './RemoteSuggestField';
import OfflineHubMessageDecorator, { OfflineHubMessageDecoratorProps } from 'decorators/OfflineHubMessageDecorator';

import * as API from 'types/api';


export interface UserSearchInputProps extends 
  Pick<RemoteSuggestFieldProps<API.HintedUser>, 'submitHandler'>, 
  Pick<OfflineHubMessageDecoratorProps, 'offlineMessage'> {
    
}

const UserSearchInput: React.FC<UserSearchInputProps> = ({ offlineMessage, submitHandler }) => (
  <OfflineHubMessageDecorator 
    offlineMessage={ offlineMessage }
  >
    <RemoteSuggestField
      placeholder="Enter nick..."
      submitHandler={ submitHandler }
      valueField="nick"
      descriptionField="hub_name"
      url={ UserConstants.SEARCH_NICKS_URL }
    />
  </OfflineHubMessageDecorator>
);

export default UserSearchInput;
