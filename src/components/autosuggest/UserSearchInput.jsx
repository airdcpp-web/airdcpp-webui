import React from 'react';

import UserConstants from 'constants/UserConstants';

import RemoteSuggestField from './RemoteSuggestField';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';


const UserSearchInput = ({ offlineMessage, submitHandler }) => (
  <OfflineHubMessageDecorator offlineMessage={offlineMessage}>
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
