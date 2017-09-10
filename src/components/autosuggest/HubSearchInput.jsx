import React from 'react';
import { default as HistoryConstants, HistoryEntryEnum } from 'constants/HistoryConstants';

import RemoteSuggestField from './RemoteSuggestField';
import Button from 'components/semantic/Button';

const HubSearchInput = ({ submitHandler }) => (
  <RemoteSuggestField
    placeholder="Enter hub address..."
    submitHandler={ submitHandler }
    valueField="hub_url"
    descriptionField="name"
    url={ HistoryConstants.SESSIONS_URL + '/' + HistoryEntryEnum.HUB + '/search' }
    button={ 
      <Button
        icon="green play"
        caption="Connect"
      />
    }
  />
);

export default HubSearchInput;
