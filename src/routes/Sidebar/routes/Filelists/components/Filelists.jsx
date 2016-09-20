import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistActions from 'actions/FilelistActions';

import AccessConstants from 'constants/AccessConstants';

import '../style.css';


const UserItemHandler = UserItemHandlerDecorator([ 'message' ]);
const ItemHandler = {
	itemLabelGetter(session) {
		return null;
	},

	itemNameGetter(session) {
		return session.share_profile ? session.share_profile.str : UserItemHandler.itemNameGetter(session);
	},

	itemIconGetter(session) {
		return session.share_profile ? <i className="large green server icon"/> : UserItemHandler.itemIconGetter(session);
	},

	itemStatusGetter(session) {
		return session.share_profile ? 'blue' : UserItemHandler.itemStatusGetter(session);
	},

	itemHeaderGetter(session, location, actionMenu) {
		if (session.share_profile) {
			return actionMenu;
		}

		return UserItemHandler.itemHeaderGetter(session, location, actionMenu);
	},

	itemDescriptionGetter(session) {
		return session.share_profile ? null : UserItemHandler.itemDescriptionGetter(session);
	},
};

const Filelists = React.createClass({
	mixins: [ Reflux.connect(FilelistSessionStore, 'filelists') ],

	render() {
		const { params, ...other } = this.props;
		return (
			<SessionLayout 
				activeId={ params.id }
				baseUrl="filelists"
				itemUrl="filelists/session"
				items={ this.state.filelists }
				newButtonCaption="Open new"
				disableSideMenu={ true }
				editAccess={ AccessConstants.FILELISTS_EDIT }
				actions={ FilelistActions }
				unreadInfoStore={ FilelistSessionStore }

				{ ...ItemHandler }
				{ ...other }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Filelists;
