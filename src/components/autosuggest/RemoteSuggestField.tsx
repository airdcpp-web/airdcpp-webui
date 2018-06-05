import PropTypes from 'prop-types';
import React from 'react';

import SocketService from 'services/SocketService';

import SuggestField, { SuggestFieldProps } from './SuggestField';
import SuggestionRenderer from './SuggestionRenderer';
import { RenderSuggestion, SuggestionsFetchRequested, Omit } from 'react-autosuggest';


type ForwardedSuggestFieldProps = Omit<
  SuggestFieldProps, 
  'onSuggestionsClearRequested' | 'onSuggestionsFetchRequested' | 'getSuggestionValue' | 'renderSuggestion' | 'suggestions'
>;

export interface RemoteSuggestFieldProps extends ForwardedSuggestFieldProps {
  valueField: string;
  descriptionField: string;
  url: string;
}

class RemoteSuggestField extends React.Component<RemoteSuggestFieldProps> {
  static propTypes = {
    valueField: PropTypes.string.isRequired,

    descriptionField: PropTypes.string.isRequired,

    url: PropTypes.string.isRequired,
  };

  state = {
    suggestions: [],
  };

  getSuggestionValue = (suggestionObj: object) => {
    return suggestionObj[this.props.valueField];
  };

  onSuggestionsFetchRequested: SuggestionsFetchRequested = ({ value }) => {
    SocketService.post(this.props.url, { 
      pattern: value, 
      max_results: 7 
    })
      .then(this.onSuggestionsReceived)
      .catch((error: any) => 
        console.log('Failed to fetch suggestions: ' + error)
      );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionsReceived = (data: any[]) => {
    this.setState({ 
      suggestions: data 
    });
  };

  renderSuggestion: RenderSuggestion<any> = (suggestionObj, { query }) => {
    return SuggestionRenderer(query, suggestionObj[this.props.valueField], suggestionObj[this.props.descriptionField]);
  };

  render() {
    return (
      <SuggestField 
        { ...this.props }
        suggestions={ this.state.suggestions }
        renderSuggestion={ this.renderSuggestion }
        getSuggestionValue={ this.getSuggestionValue }
        onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
        onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
      />
    );
  }
}

export default RemoteSuggestField;
