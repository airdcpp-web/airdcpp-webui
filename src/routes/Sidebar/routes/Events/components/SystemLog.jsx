import React from 'react';
import Reflux from 'reflux';

import EventActions from 'actions/EventActions';
import EventStore from 'stores/EventStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import LogMessage from './LogMessage';
import ScrollDecorator from 'decorators/ScrollDecorator';

import '../style.css';


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
				{ messageList }
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

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.messages !== this.state.messages;
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
							<ActionButton 
								action={ EventActions.clear }
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
