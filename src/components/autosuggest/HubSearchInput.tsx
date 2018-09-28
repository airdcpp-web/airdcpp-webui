import React from 'react';
import { default as HistoryConstants, HistoryEntryEnum } from 'constants/HistoryConstants';

import RemoteSuggestField, { RemoteSuggestFieldProps } from './RemoteSuggestField';
import Button from 'components/semantic/Button';


import * as API from 'types/api';

export interface HubSearchInputProps extends Pick<RemoteSuggestFieldProps<API.Hub>, 'submitHandler'> {

}

const HubSearchInput: React.SFC<HubSearchInputProps> = ({ submitHandler }) => (
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
