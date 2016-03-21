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

	itemDescriptionGetter(session) {
		return null;
	},

	itemIconGetter(session) {
		return <FileIcon typeInfo={ session.type }/>;
	},

	itemLabelGetter(session) {
		return null;
	},
};


const Files = React.createClass({
	mixins: [ Reflux.connect(ViewFileStore, 'files') ],
	render() {
		if (this.state.files.length === 0) {
			return (
				<Message
					title="No files to view"
					description="You may open text or image files to be viewed here (from search or filelists)"
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
				disableSideMenu={true}
				editAccess={ AccessConstants.VIEW_FILE_EDIT }
				actions={ ViewFileActions }
				unreadInfoStore={ ViewFileStore }

				{ ...ItemHandler }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Files;
