import React from 'react';
import Reflux from 'reflux';

import TextDecorator from 'components/TextDecorator';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import TypeConvert from 'utils/TypeConvert';
import AccessConstants from 'constants/AccessConstants';

import HubIcon from 'components/icon/HubIcon';


const ItemHandler = {
	itemNameGetter(session) {
		return session.identity.name;
	},

	itemStatusGetter(session) {
		return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
	},

	itemHeaderDescriptionGetter(session) {
		return (
			<TextDecorator
				text={ session.identity.description }
				emojify={ true }
			/>
		);
	},

	itemHeaderIconGetter(session) {
		return <HubIcon hub={ session } />;
	},
};

const parseNumericId = (params) => {
	if (!params) {
		return null;
	}

	return parseInt(params['id']);
};

const Hubs = React.createClass({
	mixins: [ Reflux.connect(HubSessionStore, 'hubSessions') ],
	render() {
		const { params, ...other } = this.props;
		return (
			<SessionLayout 
				activeId={ parseNumericId(params) }
				baseUrl="hubs"
				items={ this.state.hubSessions } 
				newCaption="Connect"
				newDescription="Connect to a new hub"
				newIcon="sitemap"
				editAccess={ AccessConstants.HUBS_EDIT }
				actions={ HubActions } 
				actionIds={ [ 'reconnect', 'favorite', 'clear' ] }

				unreadInfoStore={ HubSessionStore }
				{ ...ItemHandler }
				{ ...other }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Hubs;
