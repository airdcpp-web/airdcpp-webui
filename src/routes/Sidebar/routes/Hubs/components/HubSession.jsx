'use strict';
import React from 'react';

import Checkbox from 'components/semantic/Checkbox';
import History from 'utils/History';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';

import HubMessageStore from 'stores/HubMessageStore';
import HubActions from 'actions/HubActions';

import AccessConstants from 'constants/AccessConstants';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';

import HubFooter from './HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const getStorageKey = (props) => {
	return 'view_userlist_' + props.item.id;
};

const checkList = (props) => {
	const showList = sessionStorage.getItem(getStorageKey(props));
	if (showList) {
		History.pushSidebar(props.location, '/hubs/session/' + props.item.id + '/users');
	}
};

const HubSession = React.createClass({
	componentWillMount() {
		checkList(this.props);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id !== this.props.item.id) {
			checkList(nextProps);
		}
	},


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

		sessionStorage.setItem(getStorageKey(this.props), !this.props.children);
		History.pushSidebar(this.props.location, newUrl);
	},

	render() {
		const { item, children } = this.props;

		const checkbox = (
			<Checkbox
				type="toggle"
				caption="User list"
				onChange={ this.onClickUsers }
				checked={ children ? true : false }
			/>
		);

		return (
			<div className="hub chat session">
				{ this.getMessage() }
				{ this.props.children ? React.cloneElement(children, { item }) : (
					<ChatLayout
						messages={this.props.messages}
						handleSend={this.handleSend}
						location={this.props.location}
						chatAccess={ AccessConstants.HUBS_SEND }
					/>
				) }
				<HubFooter
					userlistToggle={ checkbox }
					item={ item }
				/>
			</div>
		);
	},
});

export default ChatSessionDecorator(HubSession, HubMessageStore, HubActions);