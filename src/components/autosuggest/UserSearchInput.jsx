import React from 'react';

import HubConstants from 'constants/HubConstants';

import RemoteSuggestField from './RemoteSuggestField';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';


const UserSearchInput = ({ offlineMessage, submitHandler }) => (
	<OfflineHubMessageDecorator offlineMessage={offlineMessage}>
			<RemoteSuggestField
				placeholder="Enter nick..."
				submitHandler={ submitHandler }
				valueField="nick"
				descriptionField="hub_name"
				url={ HubConstants.SEARCH_NICKS_URL }
			/>
	</OfflineHubMessageDecorator>
);

export default UserSearchInput;
