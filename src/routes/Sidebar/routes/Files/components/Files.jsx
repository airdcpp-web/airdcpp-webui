import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import ViewFileStore from 'stores/ViewFileStore';
import ViewFileActions from 'actions/ViewFileActions';

import AccessConstants from 'constants/AccessConstants';
import FileIcon from 'components/icon/FileIcon';
import Message from 'components/semantic/Message';

import '../style.css';


const ItemHandler = {
	itemNameGetter(session) {
		return session.name;
	},

	itemLabelGetter(session) {
		return null;
	},

	itemHeaderDescriptionGetter(session) {
		return null;
	},

	itemHeaderIconGetter(session) {
		return <FileIcon typeInfo={ session.type }/>;
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

		const { params, ...other } = this.props;
		return (
			<SessionLayout 
				activeId={ params.id }
				baseUrl="files"
				items={ this.state.files }
				disableSideMenu={ true }
				editAccess={ AccessConstants.VIEW_FILE_EDIT }
				actions={ ViewFileActions }
				unreadInfoStore={ ViewFileStore }

				{ ...ItemHandler }
				{ ...other }
			>
				{ this.props.children }
			</SessionLayout>
		);
	}
});

export default Files;
