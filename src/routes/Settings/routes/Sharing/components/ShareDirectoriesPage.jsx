import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
import ShareActions from 'actions/ShareActions';

import ActionButton from 'components/ActionButton';
import ShareDirectoryLayout from './ShareDirectoryLayout';

import '../style.css';

const ShareDirectoriesPage = React.createClass({
	render() {
		return (
			<div className="share-directories-settings">
				<div className="actions">
					<ActionButton action={ ShareRootActions.create } args={ [ this.props.location ] }/>
					<ActionButton action={ ShareActions.refresh }/>
				</div>
				<ShareDirectoryLayout className="directory-layout" location={ this.props.location }/>
			</div>
		);
	}
});

export default ShareDirectoriesPage;