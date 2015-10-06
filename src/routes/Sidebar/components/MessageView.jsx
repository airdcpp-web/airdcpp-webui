'use strict';

import React from 'react';

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
    var message = this.props.message.chat_message;
    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.from.nick}</h5>
        <div className="message-time">
          {message.timestamp}
        </div>
        <div className="message-text">{message.text}</div>
      </li>
    );
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
    return (
      <div className="message-section">
        <ul className="message-list" ref="messageList">
          {messageListItems}
        </ul>
      </div>
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageList.getDOMNode();
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
