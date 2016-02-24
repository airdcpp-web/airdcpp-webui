import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';
import ShareActions from 'actions/ShareActions';

import ActionButton from 'components/ActionButton';
import ShareDirectoryLayout from './directories/ShareDirectoryLayout';
import { LocationContext } from 'mixins/RouterMixin';

import '../style.css';


const ShareDirectoriesPage = React.createClass({
	mixins: [ LocationContext ],
	render() {
		return (
			<div className="share-directories-settings">
				<div className="table-actions">
					<ActionButton action={ ShareRootActions.create } args={ [ this.props.location ] }/>
					<ActionButton action={ ShareActions.refresh }/>
				</div>
				<ShareDirectoryLayout className="directory-layout"/>
			</div>
		);
	}
});

export default ShareDirectoriesPage;