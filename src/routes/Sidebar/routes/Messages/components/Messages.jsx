import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/UserSearchInput'

//import ChatSession from './ChatSession'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'

const MenuLayout = React.createClass({
  //mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions")],
  propTypes: {

    /**
     * Title of the modal
     */
    title: React.PropTypes.node.isRequired,

    /**
     * Icon to display
     */
    icon: React.PropTypes.string,

    /**
     * Close the modal when clicking outside its boundaries
     */
    closable: React.PropTypes.bool,

    /**
     * Function to call when the dialog is saved
     * If no handler is supplied, there will only be a plain close button
     */
    saveHandler: React.PropTypes.func,

    /**
     * Removes portal from DOM and redirects previous path
     * Should usually be passed from ChildModalMixin
     */
    closeHandler: React.PropTypes.func.isRequired
  },
  
  render() {
    return (
      <div>
      	
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

  render() {
    return (
      <div>
      	{ this.props.children ? 
      	  this.props.children :
	    (<div>
	      <UserSearchInput submitHandler={this._handleSubmit}/>
	    </div>) }
	  </div>
	);
  }
});

export default Messages;
