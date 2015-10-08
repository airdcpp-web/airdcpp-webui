'use strict';

import React from 'react';
import Formatter from 'utils/Format';

//import '../style.css'

var ENTER_KEY_CODE = 13;

const MessageComposer = React.createClass({
  displayName: "MessageComposer",
  propTypes: {
    /**
     * Handles sending of the message. Receives the text as param.
     */
    handleSend: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {text: ''};
  },

  render: function() {
    return (
      <div className="ui form">
      <textarea
        rows="2"
        className="message-composer"
        name="message"
        value={this.state.text}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
      </div>
    );
  },

  _onChange: function(event, value) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        this.props.handleSend(text);
      }
      this.setState({text: ''});
    }
  }
});

const MessageListItem = React.createClass({
  displayName: "MessageListItem",
  propTypes: {
    message: React.PropTypes.object
  },

  render: function() {
    let {message} = this.props;
    if (message.chat_message) {
      message = message.chat_message;
      return (
        <div className="ui item message-list-item chat-message">
          <div className="header message-author-name">{message.from.nick}</div>
          <div className="message-time">
            {Formatter.formatTimestamp(message.time)}
          </div>
          <div className="message-text">{message.text}</div>
        </div>
      );
    } else {
      message = message.log_message;
      return (
        <div className="ui item message-list-item status-message">
          <div className="message-time">
            {Formatter.formatTimestamp(message.time)}
          </div>
          <div className="message-text"><i>{message.text}</i></div>
        </div>
      );
    }
  }
});

function getMessageListItem(message) {
  return (
    <MessageListItem
      key={message.id}
      message={message}
    />
  );
}

const MessageSection = React.createClass({
  displayName: "MessageSection",
  componentDidMount: function() {
    this._scrollToBottom();
    //MessageStore.addChangeListener(this._onChange);
    //ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    //MessageStore.removeChangeListener(this._onChange);
    //ThreadStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var messageListItems = this.props.messages.map(getMessageListItem);
    console.log("MessageSection", messageListItems);
    return (
      <div className="message-section" ref="messageSection">
        <div className="ui relaxed list message-list">
          {messageListItems}
        </div>
      </div>
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageSection.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },
});

const MessageView = React.createClass({
  propTypes: {

    /**
     * List of messages
     */
    messages: React.PropTypes.array.isRequired,

    /**
     * Handles sending of the message. Receives the text as param.
     */
    handleSend: React.PropTypes.func.isRequired
  },

  displayName: "MessageView",
  render() {
    return (
      <div className="message-view">
        <MessageSection messages={this.props.messages}/>
        <MessageComposer handleSend={this.props.handleSend}/>
      </div>
    );
  },
});

export default MessageView
