import * as React from 'react';
import { default as HistoryConstants, HistoryEntryEnum } from 'constants/HistoryConstants';

import RemoteSuggestField, { RemoteSuggestFieldProps } from './RemoteSuggestField';


import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

export interface HubSearchInputProps extends Omit<RemoteSuggestFieldProps<API.Hub>, 'valueField' | 'url' | 'descriptionField'> {

}

const HubSearchInput: React.FC<HubSearchInputProps> = ({ submitHandler, ...other }) => {
  const { t } = useTranslation();
  return(
    <RemoteSuggestField
      placeholder={ translate('Enter hub address...', t, UI.Modules.HUBS) }
      submitHandler={ submitHandler }
      valueField="hub_url"
      descriptionField="name"
      url={ `${HistoryConstants.SESSIONS_URL}/${HistoryEntryEnum.HUB}/search` }
      {...other}
    />
  );
};

export default HubSearchInput;
