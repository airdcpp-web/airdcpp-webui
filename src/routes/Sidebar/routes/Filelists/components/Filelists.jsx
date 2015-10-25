import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/autosuggest/UserSearchInput'
import TopMenuLayout from 'routes/Sidebar/components/TopMenuLayout'
import NewLayout from 'routes/Sidebar/components/NewLayout'

import TypeConvert from 'utils/TypeConvert'

import FilelistSessionStore from 'stores/FilelistSessionStore'
import FilelistActions from 'actions/FilelistActions'

import '../style.css'

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
      <TopMenuLayout 
      		activeId={this.props.params ? this.props.params.id : null}
      		baseUrl="filelists"
      		itemUrl="filelists/session"
	      	location={this.props.location} 
	      	items={this.state.filelists} 
	      	nameGetter={this._nameGetter} 
	      	labelGetter={this._labelGetter}
	      	statusGetter={this._statusGetter}
	      	newButtonLabel="Open new">
      	{ this.props.children ? 
      	  this.props.children :
	    (<NewLayout title="Open list" subheader="Start browsing a new filelist" icon="sitemap">
	      <UserSearchInput submitHandler={this._handleSubmit} offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"/>
	    </NewLayout>) }
	  </TopMenuLayout>
	);
  }
});

export default Messages;
