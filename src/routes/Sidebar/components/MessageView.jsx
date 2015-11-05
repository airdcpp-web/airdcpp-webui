'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Formatter from 'utils/Format';

import ScrollDecorator from 'decorators/ScrollDecorator';
import ReactEmoji from 'react-emoji';
import Linkify from 'react-linkify';

import { ActionMenu } from 'components/Menu';
import UserActions from 'actions/UserActions';

var ENTER_KEY_CODE = 13;

const MessageComposer = React.createClass({
	propTypes: {
		/**
		 * Handles sending of the message. Receives the text as param.
		 */
		handleSend: React.PropTypes.func.isRequired
	},

	getInitialState: function () {
		return { text: '' };
	},

	render: function () {
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

	_onChange: function (event, value) {
		this.setState({ text: event.target.value });
	},

	_onKeyDown: function (event) {
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
		this.setState({ text: '' });
	}
});

const ChatMessage = React.createClass({
	mixins: [ ReactEmoji ],
	propTypes: {
		message: React.PropTypes.object
	},

	render: function () {
		const { message } = this.props;
		const { flags } = message.from;


		let userCaption = message.from.nick;
		if (flags.indexOf('hidden') < 0) {
			userCaption = <ActionMenu location={this.props.location} contextGetter={ this.props.dropdownContextGetter } icon={null} caption={ message.from.nick } actions={ UserActions } itemData={ { user: message.from, directory: '/' } }/>;
		}

		// No emojis to bot messages as they are likely to contain false matches
		return (
			<div className={ 'ui item message-list-item chat-message ' + flags.join(' ')}>
				<div className="header message-author-name">
					{userCaption}
				</div>
				<div className="message-time">
					{Formatter.formatTimestamp(message.time)}
				</div>
				<div className="message-text">
					<Linkify properties={{ target: '_blank' }}>
					{ flags.indexOf('bot') >= 0 ? message.text : this.emojify(message.text, {
						emojiType: 'twemoji'
					})}
					</Linkify>
				</div>
			</div>
		);
	}
});

const StatusMessage = React.createClass({
	propTypes: {
		message: React.PropTypes.object
	},

	render: function () {
		let { message } = this.props;
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

const MessageSection = ScrollDecorator(React.createClass({
	getMessageListItem(message) {
		if (message.chat_message) {
			return (
				<ChatMessage
					key={message.chat_message.id}
					message={message.chat_message}
					location={this.props.location}
					dropdownContextGetter={ () => ReactDOM.findDOMNode(this) }
				/>
			);
		}

		return (
			<StatusMessage
				key={message.log_message.id}
				message={message.log_message}
			/>
		);
	},

	render: function () {
		return (
			<div className="message-section">
				<div className="ui list message-list">
					{this.props.messages.map(this.getMessageListItem)}
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

	render() {
		return (
			<div className="message-view">
				<MessageSection messages={this.props.messages} location={this.props.location}/>
				<MessageComposer handleSend={this.props.handleSend}/>
			</div>
		);
	},
});

export default MessageView;
