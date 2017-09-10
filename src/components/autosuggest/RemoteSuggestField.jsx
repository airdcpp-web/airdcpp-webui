import PropTypes from 'prop-types';
import React from 'react';

import SocketService from 'services/SocketService';

import SuggestField from './SuggestField';
import SuggestionRenderer from './SuggestionRenderer';


class RemoteSuggestField extends React.Component {
  static propTypes = {
    valueField: PropTypes.string.isRequired,

    descriptionField: PropTypes.string.isRequired,

    url: PropTypes.string.isRequired,
  };

  state = {
    suggestions: [],
  };

  getSuggestionValue = (suggestionObj) => {
    return suggestionObj[this.props.valueField];
  };

  onSuggestionsFetchRequested = ({ value }) => {
    SocketService.post(this.props.url, { 
      pattern: value, 
      max_results: 7 
    })
      .then(this.onSuggestionsReceived)
      .catch(error => 
        console.log('Failed to fetch suggestions: ' + error)
      );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionsReceived = (data) => {
    this.setState({ 
      suggestions: data 
    });
  };

  renderSuggestion = (suggestionObj, { query }) => {
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
