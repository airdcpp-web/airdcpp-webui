import { useState } from 'react';

import SuggestField, { SuggestFieldProps } from './base/SuggestField';
import SuggestionRenderer from './base/SuggestionRenderer';
import { RenderSuggestion, SuggestionsFetchRequested } from 'react-autosuggest';
import { ErrorResponse } from 'airdcpp-apisocket';
import { useSocket } from 'context/SocketContext';

type ForwardedSuggestFieldProps<SuggestionT> = Omit<
  SuggestFieldProps<SuggestionT>,
  | 'onSuggestionsClearRequested'
  | 'onSuggestionsFetchRequested'
  | 'getSuggestionValue'
  | 'renderSuggestion'
  | 'suggestions'
>;
export interface RemoteSuggestFieldProps<SuggestionT extends Record<string, any>>
  extends ForwardedSuggestFieldProps<SuggestionT> {
  valueField: string;
  descriptionField: string;
  url: string;
}

const RemoteSuggestField = <SuggestionT extends Record<string, any>>({
  url,
  valueField,
  descriptionField,
  ...other
}: RemoteSuggestFieldProps<SuggestionT>) => {
  const socket = useSocket();
  const [suggestions, setSuggestions] = useState<SuggestionT[]>([]);

  const getSuggestionValue = (suggestionObj: SuggestionT) => {
    return suggestionObj[valueField];
  };

  const onSuggestionsReceived = (data: SuggestionT[]) => {
    setSuggestions(data);
  };

  const onSuggestionsFetchRequested: SuggestionsFetchRequested = ({ value }) => {
    socket
      .post(url, {
        pattern: value,
        max_results: 7,
      })
      .then(onSuggestionsReceived)
      .catch((error: ErrorResponse) =>
        console.log(`Failed to fetch suggestions: ${error}`),
      );
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderSuggestion: RenderSuggestion<SuggestionT> = (suggestionObj, { query }) => {
    return SuggestionRenderer(
      query,
      suggestionObj[valueField],
      suggestionObj[descriptionField],
    );
  };

  return (
    <SuggestField
      {...other}
      suggestions={suggestions}
      renderSuggestion={renderSuggestion}
      getSuggestionValue={getSuggestionValue}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
    />
  );
};

export default RemoteSuggestField;
