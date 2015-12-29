'use strict';
import React from 'react';

//import Button from 'components/semantic/Button';
import Checkbox from 'components/semantic/Checkbox';
import History from 'utils/History';
import ValueFormat from 'utils/ValueFormat';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';

import HubMessageStore from 'stores/HubMessageStore';
import HubActions from 'actions/HubActions';

import AccessConstants from 'constants/AccessConstants';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';

/*export const FileNameFormatter = ({ onClick, item, children }) => {
	const iconClass = classNames(
		'icon large',
		{ 'link': onClick },
		fileItemTypeToIcon(item),
	);

	return (
		<div onClick={ onClick }>
			<i className={ iconClass }/>
			{ onClick ? (
				<a>
					{ children }
				</a>
			) : children }
		</div>
	);
};*/


const GridItem = ({ label, text }) => (
	<div className="grid-item">
		<div className="ui">
			{ label + ': ' + text }
		</div>
	</div>
);

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

	onClickUsers() {
		let newUrl = '/hubs/session/' + this.props.item.id;
		if (!this.props.children) {
			newUrl += '/users';
		}

		History.pushSidebar(this.props.location, newUrl);
	},

	render() {
		const { item } = this.props;
		const users = item.identity.user_count;
		const shared = item.identity.share_size;
		return (
			<div className="hub chat session">
				{ this.getMessage() }
				{ this.props.children ? React.cloneElement(this.props.children, { item }) : (
					<ChatLayout
						messages={this.props.messages}
						handleSend={this.handleSend}
						location={this.props.location}
						chatAccess={ AccessConstants.HUBS_SEND }
					/>
				) }
				<div className="ui footer divider"/>
				<div className="ui segment session-footer">
					<div className="info-grid ui">
						<GridItem label="Users" text={ users }/>
						<GridItem label="Share" text={ ValueFormat.formatSize(shared) + ' (' + ValueFormat.formatSize(shared / users) + '/user)' }/>
					</div>
					<Checkbox
						className=""
						type="slider"
						caption="User list"
						onChange={ this.onClickUsers }
						checked={ this.props.children ? true : false }
					/>
				</div>
			</div>
		);
	},
});

export default ChatSessionDecorator(HubSession, HubMessageStore, HubActions);