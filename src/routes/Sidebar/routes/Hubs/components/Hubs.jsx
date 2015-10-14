import React from 'react';
import Reflux from 'reflux';

import TabLayout from 'routes/Sidebar/components/TabLayout'
import NewLayout from 'routes/Sidebar/components/NewLayout'

import TypeConvert from 'utils/TypeConvert'

import HubSessionStore from 'stores/HubSessionStore'
import HubActions from 'actions/HubActions'

import ActionInput from 'components/semantic/ActionInput'
import HubSearchInput from 'components/autosuggest/HubSearchInput'

const Connect = React.createClass({
  displayName: "Connect",
  _handleSubmit(hubUrl) {
  	HubActions.createSession(hubUrl, this.props.location);
  },

  render() {
    return (
      <HubSearchInput submitHandler={this._handleSubmit}/>
	  );
  }
});

const Hubs = React.createClass({
  mixins: [Reflux.connect(HubSessionStore, "hubSessions")],
  displayName: "Hubs",
  _nameGetter(session) {
  	return session.identity.name;
  },

  _labelGetter(session) {
  	return session.unread_count > 0 ? session.unread_count : null;
  },

  _statusGetter(session) {
  	return TypeConvert.hubOnlineStatusToColor(session.connect_state.id);
  },

  _getActiveId() {
    if (!this.props.params) {
      return null;
    }

    return parseInt(this.props.params["id"]);
  },

  render() {
    return (
      <TabLayout 
      		activeId={this._getActiveId()}
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
