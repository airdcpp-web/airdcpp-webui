import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';
import TypeConvert from 'utils/TypeConvert';

import { ActionMenu } from 'components/Menu';
import { HubIconFormatter } from 'utils/IconFormat';


const ItemHandler = {
	itemNameGetter(session) {
		return session.identity.name;
	},

	itemLabelGetter(session) {
		return <CountLabel unreadInfo={ LabelInfo.getHubUnreadInfo(session.unread_messages)}/>;
	},

	itemStatusGetter(session) {
		return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
	},

	itemDescriptionGetter(session) {
		if (!session) {
			return 'Connect';
		}

		return session.identity.description;
	},

	itemIconGetter(session) {
		if (!session) {
			return null;
		}

		return <HubIconFormatter size="large" hub={session} />;
	},

	itemHeaderGetter(session, location) {
		if (!session) {
			return 'Connect';
		}

		return (
			<ActionMenu 
				location={location} 
				caption={ session.identity.name } 
				actions={ HubActions } 
				itemData={ session } 
				ids={ [ 'reconnect', 'favorite' ] }
			/>
		);
	},

	itemCloseHandler(session) {
		HubActions.removeSession(session.id);
	},
};


const Hubs = React.createClass({
	mixins: [ Reflux.connect(HubSessionStore, 'hubSessions') ],

	_getActiveId() {
		if (!this.props.params) {
			return null;
		}

		return parseInt(this.props.params['id']);
	},

	render() {
		return (
			<SessionLayout 
				activeId={this._getActiveId()}
				baseUrl="hubs"
				itemUrl="hubs/session"
				location={this.props.location} 
				items={this.state.hubSessions} 
				newButtonLabel="Connect"
				{ ...ItemHandler }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Hubs;
