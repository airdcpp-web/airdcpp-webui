import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistActions from 'actions/FilelistActions';

import AccessConstants from 'constants/AccessConstants';

import '../style.css';


const userItems = UserItemHandlerDecorator({}, [ 'message' ]);
const ItemHandler = {
	itemLabelGetter(session) {
		return null;
	},

	itemNameGetter(session) {
		return session.share_profile ? session.share_profile.str : userItems.itemNameGetter(session);
	},

	itemIconGetter(session) {
		return session.share_profile ? <i className="large green server icon"/> : userItems.itemIconGetter(session);
	},

	itemStatusGetter(session) {
		return session.share_profile ? 'blue' : userItems.itemStatusGetter(session);
	},

	itemHeaderGetter(session, location, actionMenu) {
		if (session.share_profile) {
			return actionMenu;
		}

		return userItems.itemHeaderGetter(session, location, actionMenu);
	},
};

const Filelists = React.createClass({
	mixins: [ Reflux.connect(FilelistSessionStore, 'filelists') ],

	render() {
		return (
			<SessionLayout 
				activeId={this.props.params ? this.props.params.id : null}
				baseUrl="filelists"
				itemUrl="filelists/session"
				location={this.props.location} 
				items={this.state.filelists}
				newButtonCaption="Open new"
				disableSideMenu={true}
				editAccess={ AccessConstants.FILELISTS_EDIT }
				actions={ FilelistActions }
				unreadInfoStore={ FilelistSessionStore }

				{ ...ItemHandler }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Filelists;
