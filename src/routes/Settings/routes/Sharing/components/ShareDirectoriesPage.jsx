import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
import ShareActions from 'actions/ShareActions';

import Button from 'components/semantic/Button';
import ShareDirectoryLayout from './ShareDirectoryLayout';

import '../style.css';

const ShareDirectoriesPage = React.createClass({
	handleAddDirectory() {
		ShareRootActions.create(this.props.location);
	},

	handleRefresh() {
		ShareActions.refresh();
	},

	render() {
		return (
			<div className="share-directories-settings">
				<div className="actions">
					<Button
						icon="plus icon"
						onClick={this.handleAddDirectory}
						caption="Add directory"
					/>
					<Button
						icon="green refresh icon"
						onClick={this.handleRefresh}
						caption="Refresh all"
					/>
				</div>
				<ShareDirectoryLayout className="directory-layout" location={ this.props.location }/>
			</div>
		);
	}
});

export default ShareDirectoriesPage;