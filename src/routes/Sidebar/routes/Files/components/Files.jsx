import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import ViewFileStore from 'stores/ViewFileStore';
import ViewFileActions from 'actions/ViewFileActions';

import AccessConstants from 'constants/AccessConstants';
import { FileIcon } from 'utils/IconFormat';
import Message from 'components/semantic/Message';

import '../style.css';


const ItemHandler = {
	itemNameGetter(session) {
		return session.name;
	},

	itemStatusGetter(session) {
		return null;
	},

	itemDescriptionGetter(session) {
		return null;
	},

	itemIconGetter(session) {
		return <FileIcon file={ session }/>;
	},

	itemHeaderGetter(session, location, actionMenu) {
		return actionMenu;

		/*return (
			<div>
				{ actionMenu }
				{ session.name }
			</div>
		);*/

		/*return (
			<ActionMenu 
				location={ location } 
				caption={ session.identity.name } 
				actions={ HubActions } 
				itemData={ session } 
				ids={ [ 'reconnect', 'favorite' ] }
			>
				{ actionMenu }
			</ActionMenu>
		);*/
	},

	itemLabelGetter(session) {
		return null;
	},

	itemCloseHandler(session) {
		ViewFileActions.removeSession(session.id);
	},
};


const Files = React.createClass({
	mixins: [ Reflux.connect(ViewFileStore, 'files') ],
	render() {
		if (this.state.files.length === 0) {
			return (
				<Message
					title="No files to view"
					description="You can open specific files to be viewed here from search or filelists"
				/>
			);
		}

		return (
			<SessionLayout 
				activeId={ this.props.params ? this.props.params.id : null }
				baseUrl="files"
				itemUrl="files/session"
				location={this.props.location} 
				items={ this.state.files }
				//newButtonCaption="Open new"
				disableSideMenu={true}
				editAccess={ AccessConstants.VIEW_FILE_EDIT }
				actions={ ViewFileActions }

				{ ...ItemHandler }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Files;
