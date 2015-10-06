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

    History.pushSidebar(this.props.location, this.props.url);
  },

  render: function() {
    return (
      <Link to={this.props.url} className="item" onClick={this.onClick}>
        {this.props.name}
      </Link>
    );
  }

  // <i className={ this.props.icon + " icon" }></i>
});

const MenuLayout = React.createClass({
  //mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  propTypes: {
    /**
     * Unique ID of the section (used for storing and loading the previously open tab)
     */
    id: React.PropTypes.any.isRequired,

    /**
     * Location object
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Item URL
     */
    url: React.PropTypes.string.isRequired,

    /**
     * Array of items to list
     */
    items: React.PropTypes.array.isRequired,

    /**
     * Function receiving an item object that returns the display name
     */
    nameGetter: React.PropTypes.func.isRequired,

    /**
     * Function receiving an item object that returns the item ID
     */
    idGetter: React.PropTypes.func.isRequired
  },
  
  displayName: "Sidebar tabmenu",
  componentDidUpdate() {

  },

  getUrl(cid) {
  	return this.props.url + "/" + cid;
  },

  redirectTo(cid) {
  	History.replaceSidebar(this.props.location, this.getUrl(cid));
  },

  hasParams() {
  	return Object.keys(this.props.params).length > 0;
  },

  getCurrentId() {
  	return this.props.params[Object.keys(this.props.params)[0]];
  },

  saveLocation() {
  	localStorage.setItem(this.props.id + "_last_active", this.getCurrentId());
  },

  findItem(items, id) {
  	return items.find(item => this.props.idGetter(item) === id)
  },

  componentWillReceiveProps(nextProps) {
  	if (Object.keys(nextProps.params).length === 0) {
  		return;
  	}

  	// All items removed?
  	if (nextProps.items.length === 0) {
  		History.replaceSidebar(this.props.location, this.props.id);
  		return;
  	}

  	const currentId = this.getCurrentId();
  	if (nextProps.params[Object.keys(nextProps.params)[0]] !== currentId) {
  		return;
  	}

  	// Check if the current item still exists
	const item = this.findItem(nextProps.items, currentId);
    if (item) {
  	  return false;
    }

    // Find the old position
  	const oldItem = this.findItem(this.props.items, currentId);
  	const oldPos = this.props.items.indexOf(oldItem);

  	let newItemPos = oldPos;
  	if (oldPos === this.props.items.length-1) {
  	  // The last item was removed
  	  newItemPos = oldPos-1;
  	}

	this.redirectTo(this.props.idGetter(nextProps.items[newItemPos]));
  },

  componentDidUpdate() {
  	if (this.hasParams()) {
  	  this.saveLocation();
  	}
  },

  componentDidMount() {
  	if (this.hasParams()) {
  		// Loading an item already
  		this.saveLocation();
  		return;
  	}

  	let lastId = localStorage.getItem(this.props.id + "_last_active");
  	if (lastId && this.findItem(this.props.items, lastId)) {
  		this.redirectTo(lastId);
  	} else if (this.props.items.length > 0) {
  		this.redirectTo(this.props.items[0].user.cid);
  	}
  },

  render() {
    const menuItems = this.props.items.map(item => {
      const id = this.props.idGetter(item);
      return (
        <MenuItem key={ id } 
          url={this.getUrl(id)}
          name={this.props.nameGetter(item)}
          location={this.props.location}/>
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

  render() {
    return (
      <MenuLayout 
      		params={this.props.params}
      		id={"messages"}
	      	location={this.props.location} 
	      	items={this.state.chatSessions} 
	      	nameGetter={this._nameGetter} 
	      	url={'messages/session'} 
	      	idGetter={ this._idGetter }>
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
