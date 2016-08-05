import React from 'react';

import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserLayout from './users/WebUserLayout';

import { LocationContext } from 'mixins/RouterMixin';


const WebUsersPage = React.createClass({
	mixins: [ LocationContext ],
	render() {
		return (
			<div>
				<div className="table-actions">
					<ActionButton 
						action={ WebUserActions.create } 
						args={ [ this.props.location ] }
					/>
				</div>
				<WebUserLayout 
					className="user-layout" 
				/>
			</div>
		);
	}
});

export default WebUsersPage;