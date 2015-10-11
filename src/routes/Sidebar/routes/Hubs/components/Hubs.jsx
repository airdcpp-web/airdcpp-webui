import React from 'react';
import Reflux from 'reflux';

import TabLayout from 'routes/Sidebar/components/TabLayout'
import NewLayout from 'routes/Sidebar/components/NewLayout'

import TypeConvert from 'utils/TypeConvert'

import HubSessionStore from 'stores/HubSessionStore'
import HubActions from 'actions/HubActions'

import ActionInput from 'components/semantic/ActionInput'

const Connect = React.createClass({
  displayName: "Connect",
  _handleSubmit(hubUrl) {
  	HubActions.createSession(hubUrl, this.props.location);
  },

  render() {
    return (
      <ActionInput placeholder="Hub address" caption="Connect" icon="green play" handleAction={this._handleSubmit}>
	  </ActionInput>
	);
  }
});

const Hubs = React.createClass({
  mixins: [Reflux.connect(HubSessionStore, "hubSessions")],
  displayName: "Hubs",
  _nameGetter(session) {
  	return session.name;
  },

  _labelGetter(session) {
  	return session.unread_count > 0 ? session.unread_count : null;
  },

  _statusGetter(session) {
  	return "blue";
  	//const { flags } = session.user;
  	//return TypeConvert.userOnlineStatusToColor(flags);
  },

  render() {
    return (
      <TabLayout 
      		params={this.props.params}
      		baseUrl="hubs"
      		itemUrl="hubs/session"
	      	location={this.props.location} 
	      	items={this.state.hubSessions} 
	      	nameGetter={this._nameGetter} 
	      	labelGetter={this._labelGetter}
	      	statusGetter={this._statusGetter}
	      	labelColor="blue">
      	{ this.props.children ? 
      	  this.props.children :
	    (<NewLayout title="Connect" subheader="Connect to a new hub" icon="sitemap">
	      <Connect/>
	    </NewLayout>) }
	  </TabLayout>
	);
  }
});

export default Hubs;
