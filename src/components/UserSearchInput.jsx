import React from 'react';
import SocketService from 'services/SocketService.js'
import { HUB_SEARCH_NICKS_URL } from 'constants/HubConstants.js'
import Autosuggest from 'react-autosuggest'
import classNames from 'classnames';


export default React.createClass({
  propTypes: {

    /**
     * Function to call when pressing enter
     */
    submitHandler: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      text:''
    }
  },

  getDefaultProps() {
    return {
      autoFocus: true
    }
  },

  componentDidMount() {
  },

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  _getSuggestionValue(suggestionObj) {
    return suggestionObj.nick;
  },

  _getSuggestions(input, callback) {
    SocketService.post(HUB_SEARCH_NICKS_URL, { pattern: this.state.text, max_results: 7 })
      .then(data => {
        callback(null, data || []);
      })
      .catch(error => 
        callback(new Error("Failed to fetch nicks: " + error))
      );
  },

  _renderSuggestion(suggestionObj, input) {
    const escapedInput = this.escapeRegexCharacters(input);
    const nickMatchRegex = new RegExp('\\b' + escapedInput, 'i');
    const suggestion = suggestionObj.nick;

    const firstMatchIndex = suggestion.search(nickMatchRegex);

    if (firstMatchIndex === -1) {
      return suggestion;
    }

    const beforeMatch = suggestion.slice(0, firstMatchIndex);
    const match = suggestion.slice(firstMatchIndex, firstMatchIndex + input.length);
    const afterMatch = suggestion.slice(firstMatchIndex + input.length);

    return (
      <div className="content">
        <div className="header">
          {beforeMatch}<strong>{match}</strong>{afterMatch}<br />
        </div>
        <div className="description">
          { suggestionObj.hub_name }
        </div>
      </div>
    );
  },

  _handleChange(value) {
    this.setState({ 
      text: value
    });
  },

  render() {
    const inputAttributes = {
      placeholder: 'Enter nick...',
      onChange: this._handleChange,
      autoFocus: this.props.autoFocus
    };

    const buttonClass = classNames(
      "ui", 
      "button",
    );

    return (
      <div className="ui fluid action input" onKeyDown={this._onKeyDown}>
        <Autosuggest 
          ref='historyInput'
          value={this.state.text}
          suggestions={this._getSuggestions}
          inputAttributes={inputAttributes}
          onSuggestionSelected={ this.props.submitHandler } 
          suggestionRenderer={ this._renderSuggestion }
          suggestionValue={ this._getSuggestionValue }/>
      </div>
    );
  }
});
