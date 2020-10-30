import * as React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import HistoryConstants from 'constants/HistoryConstants';

import LocalSuggestField, { LocalSuggestFieldProps } from './LocalSuggestField';
import { addHistory } from 'services/api/HistoryApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { useTranslation } from 'react-i18next';


export interface HistoryInputProps extends Omit<LocalSuggestFieldProps, 'data' | 'submitHandler'> {
  historyId: string;
  submitHandler: (text: string) => void;
}

interface HistoryInputDataProps extends DataProviderDecoratorChildProps {
  history: string[];
}


const HistoryInput: React.FC<HistoryInputProps & HistoryInputDataProps> = (
  { submitHandler, historyId, history, refetchData, ...other }
) => {
  const { t } = useTranslation();
  const handleSubmit = async (text: string) => {
    await runBackgroundSocketAction(
      () => addHistory(historyId, text),
      t
    );

    refetchData();
    submitHandler(text);
  };

  return (
    <LocalSuggestField 
      { ...other }
      data={ history }
      submitHandler={ handleSubmit }
    />
  );
};

export default DataProviderDecorator<HistoryInputProps, HistoryInputDataProps>(HistoryInput, {
  urls: {
    history: ({ historyId }, socket) => socket.get(HistoryConstants.STRINGS_URL + '/' + historyId),
  },
  loaderText: null,
});
