import React from 'react';
import Reflux from 'reflux';

import ValueFormat from 'utils/ValueFormat.js';
import LogActions from 'actions/LogActions';
import LogStore from 'stores/LogStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import Button from 'components/semantic/Button';

import ScrollDecorator from 'decorators/ScrollDecorator';

import '../style.css';

const LogMessage = React.createClass({
	render: function () {
		let iconClass;
		switch (this.props.message.severity) {
			case 0: iconClass = 'blue info circle'; break;
			case 1: iconClass = 'yellow warning sign'; break;
			case 2: iconClass = 'red warning circle'; break;
		}

		return (
			<div className="log-message">
				<div className="ui message-info">
					<i className={ iconClass + ' icon' }></i>
					<div className="timestamp">{ ValueFormat.formatTimestamp(this.props.message.time) }</div>
				</div>
				<div className="message-text">
					{ this.props.message.text }
				</div>
			</div>
		);
	}
});

const SystemLog = ScrollDecorator(React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	componentWillMount: function () {
		LogActions.messagesRead();
		this.listenTo(LogStore, this._onMessagesUpdated);
	},

	getInitialState() {
		return {
			messages: LogStore.logMessages
		};
	},

	_onMessagesUpdated(messages) {
		LogActions.messagesRead();
		this.setState({ messages: messages });
	},

	render: function () {
		if (this.state.messages.length === 0) {
			return <div>No messages to show</div>;
		}

		const messageList = this.state.messages.map(function (message) {
			return (
				<LogMessage key={ message.id } message={message}/>
			);
		});

		return (
			<div className="ui segment system-log">
				<div ref="messageList" className="ui message-list">
					{messageList}
				</div>
			</div>
		);
	}
}));

const SimpleSidebarLayout = React.createClass({
	_handleClear() {
		LogActions.clear();
	},

	render: function () {
		return (
			<div className="simple-layout">
				<div className="ui segment">
					<LayoutHeader
						icon="blue history"
						title="Events"
						component={
							<Button
								caption="Clear"
								onClick={this._handleClear}
							/>
						}
					/>
					
					<div className="content">
						<SystemLog/>
					</div>
				</div>
			</div>
		);
	}
});

export default SimpleSidebarLayout;
