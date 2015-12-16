'use strict';
import React from 'react';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';

import HubMessageStore from 'stores/HubMessageStore';
import HubActions from 'actions/HubActions';

import AccessConstants from 'constants/AccessConstants';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const HubSession = React.createClass({
	handleSend(message) {
		HubActions.sendMessage(this.props.item.id, message);
	},

	getMessage() {
		const { item } = this.props;
		const connectState = item.connect_state.id;

		if (connectState === 'password') {
			return (
				<HubActionPrompt 
					title="Password required"
					icon="lock"
					content={ <PasswordPrompt hub={ item }/> }
				/>
			);
		}

		if (connectState === 'redirect') {
			return (
				<HubActionPrompt 
					title="Redirect requested"
					icon="forward mail"
					content={ <RedirectPrompt hub={ item }/> }
				/>
			);
		}

		return null;
	},

	render() {
		return (
			<div className="hub chat session">
				{ this.getMessage() }
				<ChatLayout
					messages={this.props.messages}
					handleSend={this.handleSend}
					location={this.props.location}
					chatAccess={ AccessConstants.HUBS_SEND }
				/>
			</div>
		);
	},
});

export default ChatSessionDecorator(HubSession, HubMessageStore, HubActions);