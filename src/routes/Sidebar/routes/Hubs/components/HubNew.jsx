import React from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import HubActions from 'actions/HubActions';


const HubNew = React.createClass({
	_handleConnect(hubUrl) {
		HubActions.createSession(this.props.location, hubUrl);
	},

	render() {
		return (
			<NewLayout title="Connect" subHeader="Connect to a new hub" icon="sitemap">
				<HubSearchInput submitHandler={this._handleConnect}/>
			</NewLayout>
		);
	}
});

export default HubNew;
