import React from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import HubActions from 'actions/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import HistoryConstants from 'constants/HistoryConstants';


const HubNew = React.createClass({
	handleConnect(hubUrl) {
		HubActions.createSession(this.props.location, hubUrl, HubSessionStore);
	},

	hasSession(entry) {
		return HubSessionStore.getSessionByUrl(entry.hub_url);
	},

	recentHubRender(entry) {
		return (
			<a onClick={ _ => this.handleConnect(entry.hub_url) }>
				{ entry.name }
			</a> 
		);
	},

	render() {
		return (
			<NewLayout 
				title="Connect" 
				subHeader="Connect to a new hub" 
				icon="sitemap"
				recentUrl={ HistoryConstants.HUBS_URL }
				recentTitleRenderer={ this.recentHubRender }
				hasSession={ this.hasSession }
			>
				<HubSearchInput 
					submitHandler={ this.handleConnect }
				/>
			</NewLayout>
		);
	}
});

export default HubNew;
