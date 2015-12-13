import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistActions from 'actions/FilelistActions';

import AccessConstants from 'constants/AccessConstants';

import '../style.css';


const ItemHandler = {
	itemLabelGetter(session) {
		return null;
	},

	itemCloseHandler(session) {
		FilelistActions.removeSession(session.id);
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

				{ ...UserItemHandlerDecorator(ItemHandler, [ 'message' ]) }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Filelists;
