'use strict';

import React from 'react';

import MessageView from 'routes/Sidebar/components/MessageView';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import { ActionMenu } from 'components/Menu';
import UserActions from 'actions/UserActions';

import TabHeader from 'routes/Sidebar/components/TabHeader';

import ChatSessionDecorator from 'decorators/ChatSessionDecorator';
import Format from 'utils/Format';

/*const TabFooter = React.createClass({
	render() {
		return (
			<div>
			<div className="ui grid">
				<div className="row">
					<div className="ui list">
						<div className="item">
							<i className="ui icon yellow lock"></i>
							<div className="content">
								<div className="header">Enryption</div>
								<div class="description">
									Messages are transferred through a direct enrypted channel
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</div>
		);
	},
});*/


const ChatSession = React.createClass({
	displayName: 'ChatSession',
	handleClose() {
		PrivateChatActions.removeSession(this.props.item.id);
	},

	handleSend(message) {
		PrivateChatActions.sendMessage(this.props.item.id, message);
	},

	render() {
		const { user } = this.props.item;
		const userMenu = (
			<ActionMenu 
				location={this.props.location}
				caption={ user.nicks } 
				actions={ UserActions } 
				itemData={ user } 
				ids={[ 'browse' ]}
			/>
		);

		const icon = (
			<Format.UserIconFormatter size="large" flags={user.flags} />
		);

		return (
			<div className="chat-session">
				<TabHeader
					icon={icon}
					title={userMenu}
					buttonClickHandler={this.handleClose}
					subHeader={ user.hub_names }
				/>

				<MessageView
					messages={this.props.messages}
					handleSend={this.handleSend}
					location={this.props.location}
				/>
			</div>
		);
	},
});

export default ChatSessionDecorator(ChatSession, PrivateChatMessageStore, PrivateChatActions);
