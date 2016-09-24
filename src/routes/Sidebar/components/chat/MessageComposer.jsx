'use strict';
import React from 'react';
import classNames from 'classnames';

import BrowserUtils from 'utils/BrowserUtils';
import ChatCommandHandler from './ChatCommandHandler';

const ENTER_KEY_CODE = 13;


const MessageComposer = React.createClass({
	propTypes: {
		/**
		 * Actions for this chat session type
		 */
		actions: React.PropTypes.object.isRequired,
		session: React.PropTypes.object.isRequired,
	},

	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	handleCommand(text) {
		let command, params;

		{
			// Parse the command
			const whitespace = text.indexOf(' ');
			if (whitespace === -1) {
				command = text.substr(1);
			} else {
				command = text.substr(1, whitespace - 1);
				params = text.substr(whitespace + 1);
			}
		}

		ChatCommandHandler(this.props).handle(command, params);
	},

	handleSend(message) {
		const { actions, session } = this.props;
		actions.sendMessage(session, message);
	},

	getStorageKey(context) {
		return 'last_message_' + context.routerLocation.pathname;
	},

	saveText() {
		const { text } = this.state;
		BrowserUtils.saveSessionProperty(this.getStorageKey(this.context), text);
	},

	loadState(context) {
		return {
			text: BrowserUtils.loadSessionProperty(this.getStorageKey(context), ''),
		};
	},

	getInitialState: function () {
		return this.loadState(this.context);
	},

	componentWillUnmount() {
		this.saveText();
	},

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextContext.routerLocation.pathname !== this.context.routerLocation.pathname) {
			this.saveText();
			this.setState(this.loadState(nextContext));
		}
	},

	render: function () {
		const mobile = BrowserUtils.useMobileLayout();
		const className = classNames(
			'ui form composer',
			{ 'small': mobile },
			{ 'large': !mobile },
		);

		return (
			<div className= { className }>
				<textarea
					rows={ mobile ? 1 : 2 }
					name="message"
					value={ this.state.text }
					onChange={ this._onChange }
					onKeyDown={ this._onKeyDown }
				/>
				<div 
					className="blue large ui icon button" 
					onClick={ this._sendText }
				>
					<i className="send icon"/>
				</div>
			</div>
		);
	},

	_onChange: function (event) {
		this.setState({ 
			text: event.target.value 
		});
	},

	_onKeyDown: function (event) {
		if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
			event.preventDefault();
			this._sendText();
		}
	},

	_sendText() {
		// Trim only from end to allow chat messages such as " +help" to be
		// sent to other users
		// This will also prevent sending empty messages
		const text = this.state.text.replace(/\s+$/, '');

		if (text) {
			if (text[0] === '/') {
				this.handleCommand(text);
			} else {
				this.handleSend(text);
			}
		}

		this.setState({ text: '' });
	}
});

export default MessageComposer;