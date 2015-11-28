import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';

import Button from 'components/semantic/Button';
import ShareDirectoryLayout from './ShareDirectoryLayout';

import '../style.css';

const ShareDirectoriesPage = React.createClass({
	_handleAddDirectory() {
		ShareRootActions.create(this.props.location);
	},

	render() {
		return (
			<div className="share-directories-settings">
				<div className="actions">
					<Button
						icon="plus icon"
						onClick={this._handleAddDirectory}
						caption="Add directory"
					/>
				</div>
				<ShareDirectoryLayout className="directory-layout" location={ this.props.location }/>
			</div>
		);
	}
});

export default ShareDirectoriesPage;