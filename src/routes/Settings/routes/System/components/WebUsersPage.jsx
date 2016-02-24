import React from 'react';

import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserLayout from './users/WebUserLayout';


const WebUsersPage = React.createClass({
	render() {
		return (
			<div className="web-users-settings">
				<div className="table-actions">
					<ActionButton 
						action={ WebUserActions.create } 
						args={ [ this.props.location ] }
					/>
				</div>
				<WebUserLayout 
					className="user-layout" 
					location={ this.props.location }
				/>
			</div>
		);
	}
});

export default WebUsersPage;