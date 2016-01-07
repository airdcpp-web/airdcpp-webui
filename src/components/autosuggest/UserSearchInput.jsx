import React from 'react';

import HubConstants from 'constants/HubConstants';

import RemoteSuggestField from './RemoteSuggestField';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';


const UserSearchInput = React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func.isRequired,
	},

	render() {
		return (
			<OfflineHubMessageDecorator offlineMessage={this.props.offlineMessage}>
				<div className="ui fluid input">
					<RemoteSuggestField
						placeholder="Enter nick..."
						submitHandler={ this.props.submitHandler }
						valueField="nick"
						descriptionField="hub_name"
						url={ HubConstants.SEARCH_NICKS_URL }
					/>
				</div>
			</OfflineHubMessageDecorator>
		);
	},
});

export default UserSearchInput;
