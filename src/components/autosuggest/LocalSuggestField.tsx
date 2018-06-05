import PropTypes from 'prop-types';
import React from 'react';

import SuggestionRenderer from './SuggestionRenderer';
import SuggestField from './SuggestField';

import escapeStringRegexp from 'escape-string-regexp';


interface LocalSuggestFieldProps {
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
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ 
      suggestions: this.filterSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderSuggestion = (dataItem, { query }) => {
    return SuggestionRenderer(query, dataItem);
  };

  getSuggestionValue = (suggestion) => {
    return suggestion;
  };

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
