import React from 'react';
import SocketService from '../services/SocketService.js'
import { HISTORY_ITEM_URL, HISTORY_ITEMS_URL } from '../constants/HistoryConstants.js'
import Autosuggest from 'react-autosuggest'


export default React.createClass({
  propTypes: {

    /**
     * Function to call when pressing enter
     */
    submitHandler: React.PropTypes.func.isRequired,

    /**
     * ID of the history section
     */
    historyId: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      history: []
    }
  },

  componentDidMount() {
    this._loadHistory();
  },

  _loadHistory() {
    SocketService.get(HISTORY_ITEMS_URL + "/" + this.props.historyId)
      .then(data => {
        this.setState({ history: data });
      })
      .catch(error => 
        console.error("Failed to load history: " + error)
      );
  },

  _onKeyDown: function(event) {
    if (event.keyCode === 13) {
      this._handleSubmit(event.target.value);
    }
  },

  _handleSubmit(text) {
    SocketService.post(HISTORY_ITEM_URL + "/" + this.props.historyId, { item: text })
      .then(data => {
      })
      .catch(error => 
        console.error("Failed to post history: " + error)
      );
    console.log("Searching");
    this._loadHistory();
    this.props.submitHandler(text);
  },

  _getSuggestions(input, callback) {
    const regex = new RegExp('^' + input, 'i');
    const suggestions = this.state.history.filter(str => regex.test(str));

    callback(null, suggestions);
  },

  render() {
    const inputAttributes = {
      placeholder: 'Enter search string...',
      //onChange: value => console.log(`Input value changed to: ${value}`),
      //onBlur: event => console.log('Input blurred. Event:', event),
    };

    return (
      <div className="ui fluid icon input" onKeyDown={this._onKeyDown}>
        <i className="search icon"></i>
        <Autosuggest 
          suggestions={this._getSuggestions}
          inputAttributes={inputAttributes} />
      </div>
    );
  }
});
