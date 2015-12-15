import React from 'react';
import Reflux from 'reflux';

import ValueFormat from 'utils/ValueFormat.js';
import LogActions from 'actions/LogActions';
import LogStore from 'stores/LogStore';
import { SeverityEnum } from 'constants/LogConstants';

import LayoutHeader from 'components/semantic/LayoutHeader';
import Button from 'components/semantic/Button';
import Loader from 'components/semantic/Loader';

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

const SystemLog = ScrollDecorator(React.createClass({
	mixins: [ Reflux.connect(LogStore, 'messages'), ],
	componentWillMount: function () {
		LogActions.setActive(true);
		LogActions.setRead();

		if (!this.state.messages) {
			LogActions.fetchMessages();
		}
	},

	componentWillUnmount() {
		LogActions.setActive(false);
	},

	render: function () {
		if (!this.state.messages) {
			return <Loader text="Loading messages"/>;
		}

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
