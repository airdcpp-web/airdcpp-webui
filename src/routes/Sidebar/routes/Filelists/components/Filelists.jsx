import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/autosuggest/UserSearchInput'
import TabLayout from 'routes/Sidebar/components/TabLayout'
import NewLayout from 'routes/Sidebar/components/NewLayout'

import TypeConvert from 'utils/TypeConvert'

import FilelistSessionStore from 'stores/FilelistSessionStore'
import FilelistActions from 'actions/FilelistActions'

const Messages = React.createClass({
  mixins: [Reflux.connect(FilelistSessionStore, "filelists")],
  displayName: "Filelists",
  _handleSubmit(user) {
  	FilelistActions.createSession(user, this.props.location);
  },

  _nameGetter(session) {
  	return session.user.nicks;
  },

  _idGetter(session) {
  	return session.user.cid;
  },

  _labelGetter(session) {
  	//return session.unread_count > 0 ? session.unread_count : null;
  	return null;
  },

  _statusGetter(session) {
  	const { flags } = session.user;
  	return TypeConvert.userOnlineStatusToColor(flags);
  },

  render() {
    return (
      <TabLayout 
      		activeId={this.props.params ? this.props.params.id : null}
      		baseUrl="filelists"
      		itemUrl="filelists/session"
	      	location={this.props.location} 
	      	items={this.state.filelists} 
	      	nameGetter={this._nameGetter} 
	      	labelGetter={this._labelGetter}
	      	statusGetter={this._statusGetter}
	      	labelColor="blue">
      	{ this.props.children ? 
      	  this.props.children :
	    (<NewLayout title="Open list" subheader="Start browsing a new filelist" icon="sitemap">
	      <UserSearchInput submitHandler={this._handleSubmit}/>
	    </NewLayout>) }
	  </TabLayout>
	);
  }
});

export default Messages;
