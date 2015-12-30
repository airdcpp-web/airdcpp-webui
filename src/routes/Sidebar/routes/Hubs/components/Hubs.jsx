import React from 'react';
import Reflux from 'reflux';

import Linkify from 'react-linkify';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import TypeConvert from 'utils/TypeConvert';
import AccessConstants from 'constants/AccessConstants';

import { ActionMenu } from 'components/menu/DropdownMenu';
import { HubIconFormatter } from 'utils/IconFormat';


const ItemHandler = {
	itemNameGetter(session) {
		return session.identity.name;
	},

	itemStatusGetter(session) {
		return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
	},

	itemDescriptionGetter(session) {
		return (
			<Linkify properties={{ target: '_blank' }}>
				{ session.identity.description }
			</Linkify>
		);
	},

	itemIconGetter(session) {
		return <HubIconFormatter size="large" hub={session} />;
	},

	itemHeaderGetter(session, location, actionMenu) {
		return (
			<ActionMenu 
				location={ location } 
				caption={ session.identity.name } 
				actions={ HubActions } 
				itemData={ session } 
				ids={ [ 'reconnect', 'favorite'/*, 'clear'*/ ] }
			>
				{ actionMenu }
			</ActionMenu>
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
				newButtonCaption="Connect"
				editAccess={ AccessConstants.HUBS_EDIT }
				actions={ HubActions } 

				unreadInfoStore={ HubSessionStore }
				{ ...ItemHandler }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Hubs;
