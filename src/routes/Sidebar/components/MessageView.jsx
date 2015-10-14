'use strict';

import React from 'react';
import Formatter from 'utils/Format';

import ScrollDecorator from 'decorators/ScrollDecorator'

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
          resize="none"
          rows="2"
          className="message-composer"
          name="message"
          value={this.state.text}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
        />
        <div className="blue large ui icon button" onClick={ this._sendText }>
          <i className="send icon"></i>
        </div>
      </div>
    );
  },

  _onChange: function(event, value) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      this._sendText();
    }
  },

  _sendText() {
    var text = this.state.text.trim();
    if (text) {
      this.props.handleSend(text);
    }
    this.setState({text: ''});
  }
});

const ChatMessage = React.createClass({
  displayName: "ChatMessage",
  propTypes: {
    message: React.PropTypes.object
  },

  render: function() {
    let {message} = this.props;
    return (
      <div className="ui item message-list-item chat-message">
        <div className="header message-author-name">{message.from.nick}</div>
        <div className="message-time">
          {Formatter.formatTimestamp(message.time)}
        </div>
        <div className="message-text">{message.text}</div>
      </div>
    );
  }
});

const StatusMessage = React.createClass({
  displayName: "StatusMessage",
  propTypes: {
    message: React.PropTypes.object
  },

  render: function() {
    let {message} = this.props;
    return (
      <div className="ui item message-list-item status-message">
        <div className="message-time">
          {Formatter.formatTimestamp(message.time)}
        </div>
        <div className="message-text"><i>{message.text}</i></div>
      </div>
    );
  }
});

function convertMessageText(text) {
  //let tmp = text.replace(/(?:\r\n|\r|\n)/g, '<br />');

}

function getMessageListItem(message) {
  if (message.chat_message) {
    return (
      <ChatMessage
        key={message.chat_message.id}
        message={message.chat_message}
      />
    );
  }

  return (
    <StatusMessage
      key={message.log_message.id}
      message={message.log_message}
    />
  );
}

const MessageSection = ScrollDecorator(React.createClass({
  displayName: "MessageSection",
  render: function() {
    var messageListItems = this.props.messages.map(getMessageListItem);
    //console.log("MessageSection", messageListItems);
    return (
      <div className="message-section">
        <div className="ui relaxed list message-list">
          {messageListItems}
        </div>
      </div>
    );
  },
}));

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
