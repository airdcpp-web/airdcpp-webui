import React from 'react';
import Reflux from 'reflux';

import ValueFormat from 'utils/ValueFormat.js';
import EventActions from 'actions/EventActions';
import EventStore from 'stores/EventStore';
import { SeverityEnum } from 'constants/EventConstants';

import LayoutHeader from 'components/semantic/LayoutHeader';
import Button from 'components/semantic/Button';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import ScrollDecorator from 'decorators/ScrollDecorator';

import '../style.css';

const LogMessage = ({ message }) => {
	let iconClass;
	switch (message.severity) {
		case SeverityEnum.INFO: iconClass = 'blue info circle'; break;
		case SeverityEnum.WARNING: iconClass = 'yellow warning sign'; break;
		case SeverityEnum.ERROR: iconClass = 'red warning circle'; break;
	}

	return (
		<div className="log-message">
			<div className="ui message-info">
				<i className={ iconClass + ' icon' }></i>
				<div className="timestamp">{ ValueFormat.formatTimestamp(message.time) }</div>
			</div>
			<div className="message-text">
				{ message.text }
			</div>
		</div>
	);
};

const MessageView = ScrollDecorator(React.createClass({
	render: function () {
		const { messages } = this.props;
		if (!messages) {
			return <Loader text="Loading messages"/>;
		}

		if (messages.length === 0) {
			return (
				<Message 
					description="No messages to show"
				/>
			);
		}

		const messageList = messages.map(function (message) {
			return (
				<LogMessage key={ message.id } message={message}/>
			);
		});

		return (
			<div ref="messageList" className="message-list ui segment">
				{messageList}
			</div>
		);
	}
}));

const SystemLog = React.createClass({
	mixins: [ Reflux.connect(EventStore, 'messages'), ],
	componentWillMount: function () {
		EventActions.setActive(true);
		EventActions.setRead();

		if (!this.state.messages) {
			EventActions.fetchMessages();
		}
	},

	componentWillUnmount() {
		EventActions.setActive(false);
	},

	_handleClear() {
		EventActions.clear();
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
					
					<div className="layout-content system-log">
						<MessageView messages={ this.state.messages }/>
					</div>
				</div>
			</div>
		);
	}
});

export default SystemLog;
