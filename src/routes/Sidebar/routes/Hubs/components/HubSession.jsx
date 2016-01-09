'use strict';
import React from 'react';

import Checkbox from 'components/semantic/Checkbox';
import History from 'utils/History';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';

import HubMessageStore from 'stores/HubMessageStore';
import HubActions from 'actions/HubActions';
import AccessConstants from 'constants/AccessConstants';

import HubFooter from './HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const getStorageKey = (props) => {
	return 'view_userlist_' + props.item.id;
};

const checkList = (props) => {
	const showList = JSON.parse(sessionStorage.getItem(getStorageKey(props)));
	if (showList) {
		History.pushSidebar(props.location, '/hubs/session/' + props.item.id + '/users');
		return true;
	}

	return false;
};

const HubSession = React.createClass({
	componentWillMount() {
		this.showList = checkList(this.props);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id !== this.props.item.id) {
			this.showList = checkList(nextProps);
		}
	},

	getMessage() {
		const { item } = this.props;
		const connectState = item.connect_state.id;

		if (connectState === 'password' && !item.connect_state.has_password) {
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
		this.showList = !this.showList;

		let newUrl = '/hubs/session/' + this.props.item.id;
		if (this.showList) {
			newUrl += '/users';
		}

		sessionStorage.setItem(getStorageKey(this.props), JSON.stringify(this.showList));
		History.pushSidebar(this.props.location, newUrl);
	},

	render() {
		const { item, children } = this.props;

		const checkbox = (
			<Checkbox
				type="toggle"
				caption="User list"
				onChange={ this.onClickUsers }
				checked={ this.showList }
			/>
		);

		if (this.showList && !children) {
			// Redirecting, don't mount anything
			return null;
		}

		return (
			<div className="hub chat session">
				{ this.getMessage() }
				{ this.showList ? React.cloneElement(children, { item }) : (
					<ChatLayout
						messageStore={ HubMessageStore }
						chatActions={ HubActions }
						location={ this.props.location }
						chatAccess={ AccessConstants.HUBS_SEND }
						session={ this.props.item }
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

export default HubSession;