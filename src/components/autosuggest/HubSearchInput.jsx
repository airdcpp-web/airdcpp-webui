import React from 'react';
import HistoryConstants from 'constants/HistoryConstants';

import RemoteSuggestField from './RemoteSuggestField';
import Button from 'components/semantic/Button';

const HubSearchInput = ({ submitHandler }) => (
	<RemoteSuggestField
		placeholder="Enter hub address..."
		submitHandler={ submitHandler }
		valueField="hub_url"
		descriptionField="name"
		url={ HistoryConstants.HUBS_SEARCH_URL }
		button={ 
			<Button
				icon="green play"
				caption="Connect"
			/>
		}
	/>
);

export default HubSearchInput;
