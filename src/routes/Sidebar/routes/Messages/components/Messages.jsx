import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/UserSearchInput'

//import ChatSession from './ChatSession'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'
import {PRIVATE_CHAT_SESSION_URL} from 'constants/PrivateChatConstants';

import { Link } from 'react-router';

import History from 'utils/History'

const MenuItem = React.createClass({
  displayName: "Sidebar tabmenu item",
  onClick: function(evt) {
    evt.preventDefault();

    History.pushSidebar(this.props.location, this.getUrl());
  },

  getUrl: function() {
  	return this.props.url + "/" + this.props.idGetter(this.props.item);
  },

  render: function() {
    return (
      <Link to={this.getUrl()} className="item" onClick={this.onClick}>
        <i className={ this.props.icon + " icon" }></i>
        {this.props.nameGetter(this.props.item)}
      </Link>
    );
  }
});

const MenuLayout = React.createClass({
  //mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  propTypes: {
    /**
     * Icon to display
     */
    url: React.PropTypes.string,

    /**
     * Close the modal when clicking outside its boundaries
     */
    items: React.PropTypes.array,

    /**
     * Function to call when the dialog is saved
     * If no handler is supplied, there will only be a plain close button
     */
    nameGetter: React.PropTypes.func.isRequired,

    /**
     * Removes portal from DOM and redirects previous path
     * Should usually be passed from ChildModalMixin
     */
    idGetter: React.PropTypes.func.isRequired
  },
  
  displayName: "Sidebar tabmenu",
  render() {
    const menuItems = this.props.items.map(item => {
      return (
        <MenuItem key={ this.props.idGetter(item) } 
          item={item}
          {...this.props}/>
      );
    }, this);

    return (
	    <div className="ui grid">
	      <div className="four wide column">
	        <div className="ui vertical fluid tabular menu">
	          { menuItems }
	        </div>
	      </div>
	      <div className="twelve wide stretched column">
	        <div className="ui segment">
	          { this.props.children }
	        </div>
	      </div>
	    </div>
	);
  }
});

const Messages = React.createClass({
  mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  displayName: "Messages",
  _handleSubmit(text) {
  	console.log(text);
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

  render() {
    return (
      <MenuLayout location={this.props.location} items={this.state.chatSessions} nameGetter={this._nameGetter} url={'messages/session'} idGetter={ this._idGetter }>
      	{ this.props.children ? 
      	  this.props.children :
	    (<div>
	      <UserSearchInput submitHandler={this._handleSubmit}/>
	    </div>) }
	  </MenuLayout>
	);
  }
});

export default Messages;
