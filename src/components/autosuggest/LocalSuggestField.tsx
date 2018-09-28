import PropTypes from 'prop-types';
import React from 'react';

import SuggestionRenderer from './SuggestionRenderer';
import SuggestField, { SuggestFieldProps } from './SuggestField';

import escapeStringRegexp from 'escape-string-regexp';
import { Omit, RenderSuggestion, SuggestionsFetchRequested } from 'react-autosuggest';


type ForwardedSuggestFieldProps = Omit<
  SuggestFieldProps<string>, 
  'onSuggestionsClearRequested' | 'onSuggestionsFetchRequested' | 
  'getSuggestionValue' | 'renderSuggestion' | 'suggestions'
>;

export interface LocalSuggestFieldProps extends ForwardedSuggestFieldProps {
  data: string[];
}

class LocalSuggestField extends React.Component<LocalSuggestFieldProps> {
  static propTypes = {
    data: PropTypes.array.isRequired,

    onChange: PropTypes.func,
  };

  state = {
    suggestions: [],
  };

  filterSuggestions = (text: string) => {
    const regex = new RegExp('^' + escapeStringRegexp(text), 'i');
    return this.props.data.filter(str => regex.test(str));
  }

  onSuggestionsFetchRequested: SuggestionsFetchRequested = ({ value }) => {
    this.setState({ 
      suggestions: this.filterSuggestions(value),
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }

  renderSuggestion: RenderSuggestion<string> = (dataItem, { query }) => {
    return SuggestionRenderer(query, dataItem);
  }

  getSuggestionValue = (suggestion: string) => {
    return suggestion;
  }

  render() {
    return (
      <SuggestField 
        { ...this.props }
        renderSuggestion={ this.renderSuggestion }
        getSuggestionValue={ this.getSuggestionValue }
        suggestions={ this.state.suggestions }
        onChange={ this.props.onChange }
        onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
        onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
      />
    );
  }
}

export default LocalSuggestField;
