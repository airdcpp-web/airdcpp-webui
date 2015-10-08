import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/UserSearchInput'
import TabLayout from 'routes/Sidebar/components/TabLayout'

import TypeConvert from 'utils/TypeConvert'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'
import {PRIVATE_CHAT_SESSION_URL} from 'constants/PrivateChatConstants';


const NewLayout = React.createClass({
  propTypes: {
    /**
     * Title of the button
     */
    title: React.PropTypes.any.isRequired,

    /**
     * Title of the button
     */
    subheader: React.PropTypes.any,
  },

  displayName: "SidebarNewLayout",
  render: function() {
    return (
      <div>
      	<h2 className="ui header sidebar-new">
	      	<i className={ this.props.icon + " icon" }></i>
	      	<div className="content">
		        {this.props.title}
		        { this.props.subheader ? <div className="sub header">{ this.props.subheader }</div> : null }
	        </div>
        </h2>
        {this.props.children}
      </div>
    );
  }
});

const Messages = React.createClass({
  mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  displayName: "Messages",
  _handleSubmit(user) {
  	PrivateChatActions.createSession(user, this.props.location);
  },

  _nameGetter(session) {
  	return session.user.nicks;
  },

  _idGetter(session) {
  	return session.user.cid;
  },

  handleSelect(session) {
  	this.props.location.pushState(...this.props.location.state, PRIVATE_CHAT_SESSION_URL + session.user.cid);
  },

  _labelGetter(session) {
  	return session.unread_count > 0 ? session.unread_count : null;
  },

  _statusGetter(session) {
  	const { flags } = session.user;
  	return TypeConvert.userOnlineStatusToColor(flags);
  },

  render() {
    return (
      <TabLayout 
      		params={this.props.params}
      		baseUrl="messages"
      		itemUrl="messages/session"
	      	location={this.props.location} 
	      	items={this.state.chatSessions} 
	      	nameGetter={this._nameGetter} 
	      	idGetter={ this._idGetter }
	      	labelGetter={this._labelGetter}
	      	statusGetter={this._statusGetter}
	      	labelColor="red">
      	{ this.props.children ? 
      	  this.props.children :
	    (<NewLayout title="Send message" subheader="Start a new private chat session" icon="comments">
	      <UserSearchInput submitHandler={this._handleSubmit}/>
	    </NewLayout>) }
	  </TabLayout>
	);
  }
});

export default Messages;
