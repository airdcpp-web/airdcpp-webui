import React from 'react';
import Reflux from 'reflux';

import SideMenuLayout from 'routes/Sidebar/components/SideMenuLayout';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import TypeConvert from 'utils/TypeConvert';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import HubSearchInput from 'components/autosuggest/HubSearchInput';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

const Hubs = React.createClass({
	mixins: [ Reflux.connect(HubSessionStore, 'hubSessions') ],
	displayName: 'Hubs',
	_nameGetter(session) {
		return session.identity.name;
	},

	_labelGetter(session) {
		return <CountLabel unreadInfo={ LabelInfo.getHubUnreadInfo(session.unread_messages)}/>;
	},

	_statusGetter(session) {
		return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
	},

	_getActiveId() {
		if (!this.props.params) {
			return null;
		}

		return parseInt(this.props.params['id']);
	},

	_handleConnect(hubUrl) {
		HubActions.createSession(hubUrl, this.props.location);
	},

	render() {
		return (
			<SideMenuLayout 
				activeId={this._getActiveId()}
				baseUrl="hubs"
				itemUrl="hubs/session"
				location={this.props.location} 
				items={this.state.hubSessions} 
				nameGetter={this._nameGetter} 
				labelGetter={this._labelGetter}
				statusGetter={this._statusGetter}
				newButtonLabel="Connect"
			>
				{ this.props.children ? 
					this.props.children :
				(<NewLayout title="Connect" subheader="Connect to a new hub" icon="sitemap">
					<HubSearchInput submitHandler={this._handleConnect}/>
				</NewLayout>) }
			</SideMenuLayout>
		);
	}
});

export default Hubs;
