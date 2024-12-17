import { Component } from 'react';

import SocketService from 'services/SocketService';

import SuggestField, { SuggestFieldProps } from './base/SuggestField';
import SuggestionRenderer from './base/SuggestionRenderer';
import { RenderSuggestion, SuggestionsFetchRequested } from 'react-autosuggest';
import { ErrorResponse } from 'airdcpp-apisocket';

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

class RemoteSuggestField<SuggestionT extends Record<string, any>> extends Component<
  RemoteSuggestFieldProps<SuggestionT>
> {
  state = {
    suggestions: [] as SuggestionT[],
  };

  getSuggestionValue = (suggestionObj: SuggestionT) => {
    return suggestionObj[this.props.valueField];
  };

  onSuggestionsFetchRequested: SuggestionsFetchRequested = ({ value }) => {
    SocketService.post(this.props.url, {
      pattern: value,
      max_results: 7,
    })
      .then(this.onSuggestionsReceived)
      .catch((error: ErrorResponse) =>
        console.log(`Failed to fetch suggestions: ${error}`),
      );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionsReceived = (data: SuggestionT[]) => {
    this.setState({
      suggestions: data,
    });
  };

  renderSuggestion: RenderSuggestion<SuggestionT> = (suggestionObj, { query }) => {
    return SuggestionRenderer(
      query,
      suggestionObj[this.props.valueField],
      suggestionObj[this.props.descriptionField],
    );
  };

  render() {
    return (
      <SuggestField
        {...this.props}
        suggestions={this.state.suggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      />
    );
  }
}

export default RemoteSuggestField;
