import React from 'react';
import { default as HistoryConstants, HistoryEntryEnum } from 'constants/HistoryConstants';

import RemoteSuggestField, { RemoteSuggestFieldProps } from './RemoteSuggestField';
import Button from 'components/semantic/Button';


import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

export interface HubSearchInputProps extends Pick<RemoteSuggestFieldProps<API.Hub>, 'submitHandler'> {

}

const HubSearchInput: React.FC<HubSearchInputProps> = ({ submitHandler }) => {
  const { t } = useTranslation();
  return(
    <RemoteSuggestField
      placeholder={ translate('Enter hub address...', t, UI.Modules.HUBS) }
      submitHandler={ submitHandler }
      valueField="hub_url"
      descriptionField="name"
      url={ `${HistoryConstants.SESSIONS_URL}/${HistoryEntryEnum.HUB}/search` }
      button={ 
        <Button
          icon="green play"
          caption={ translate('Connect', t, UI.Modules.HUBS) }
        />
      }
    />
  );
};

export default HubSearchInput;
