'use strict';
import React from 'react';

import Checkbox from 'components/semantic/Checkbox';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from './HubUserTable';

import HubMessageStore from 'stores/HubMessageStore';

import HubActions from 'actions/HubActions';
import { ConnectStateEnum } from 'constants/HubConstants';
import AccessConstants from 'constants/AccessConstants';

import HubFooter from './HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const getStorageKey = (props) => {
	return 'view_userlist_' + props.item.id;
};

const checkList = (props) => {
	const showList = JSON.parse(sessionStorage.getItem(getStorageKey(props)));
	return showList ? true : false;
};

const HubSession = React.createClass({
	componentWillMount() {
		this.showList = checkList(this.props);
	},

	getInitialState() {
		return {
			showList: checkList(this.props),
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id !== this.props.item.id && this.state.showList !== checkList(nextProps)) {
			this.toggleListState();
		}
	},

	toggleListState() {
		this.setState({ showList: !this.state.showList });
	},

	getMessage() {
		const { item } = this.props;
		const connectState = item.connect_state.id;

		if (connectState === ConnectStateEnum.PASSWORD && !item.connect_state.has_password) {
			return (
				<HubActionPrompt 
					title="Password required"
					icon="lock"
					content={ <PasswordPrompt hub={ item }/> }
				/>
			);
		}

		if (connectState === ConnectStateEnum.REDIRECT) {
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
		this.toggleListState();

		sessionStorage.setItem(getStorageKey(this.props), JSON.stringify(this.state.showList));
	},

	render() {
		const { item, location } = this.props;

		const checkbox = (
			<Checkbox
				type="toggle"
				caption="User list"
				onChange={ this.onClickUsers }
				checked={ this.showList }
			/>
		);

		return (
			<div className="hub chat session">
				{ this.getMessage() }
				{ this.state.showList ? (
						<HubUserTable
							item={ item }
							location={ location }
						/>
					) : (
						<ChatLayout
							messageStore={ HubMessageStore }
							chatActions={ HubActions }
							location={ location }
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