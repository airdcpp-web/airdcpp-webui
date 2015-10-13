'use strict';

import React from 'react';

import MessageView from 'routes/Sidebar/components/MessageView'
import SocketService from 'services/SocketService.js'

import HubSessionStore from 'stores/HubSessionStore'
import HubMessageStore from 'stores/HubMessageStore'
import HubActions from 'actions/HubActions'

//import {PRIVATE_CHAT_SESSION_URL, PRIVATE_CHAT_MESSAGE} from 'constants/PrivateChatConstants';

import { ActionMenu } from 'components/Menu'
import ActionInput from 'components/semantic/ActionInput'

import TabHeader from 'routes/Sidebar/components/TabHeader'
import ChatSessionDecorator from 'decorators/ChatSessionDecorator'
import Format from 'utils/Format'

const HubActionPrompt = React.createClass({
  propTypes: {
    /**
     * Message title
     */
    title: React.PropTypes.node.isRequired,

    /**
     * Error details
     */
    content: React.PropTypes.node.isRequired,
  },

  displayName: "HubActionPrompt",
  render: function() {
    return (
      <div className="ui icon message">
        <i class={ this.props.icon + " icon"}></i>
        <div className="header">
          { this.props.title }
        </div>
        <p>{this.props.content}</p>
      </div>
    );
  }
});

const PasswordPrompt = React.createClass({
  displayName: "PasswordPrompt",
  _handleSubmit(text) {
    HubActions.password(this.props.hub, text);
  },

  render: function() {
    return (
      <ActionInput placeholder="Password" caption="Enter password" icon="green play" handleAction={this._handleSubmit}/>
    );
  }
});

const RedirectPrompt = React.createClass({
  displayName: "RedirectPrompt",
  _handleSubmit() {
    HubActions.redirect(this.props.hub);
  },

  render: function() {
    return (
      <div className="ui button" caption="Enter password" icon="green play" onClick={this._handleSubmit}/>
    );
  }
});

const HubSession = React.createClass({
  displayName: "HubSession",
  handleClose() {
    HubActions.removeSession(this.props.item.id);
  },

  handleSend(message) {
    HubActions.sendMessage(this.props.item.id, message);
  },

  getMessage() {
    const connectState = this.props.item.connect_state;
    if (connectState === "password") {
      return (
        <HubActionPrompt 
          title="Password required"
          icon="lock"
          content={ <PasswordPrompt hub={this.props.item}/> }/>
        );
    } else if (connectState === "redirect") {
      return (
        <HubActionPrompt 
          title="Redirect requested"
          icon="forward mail"
          content={ <RedirectPrompt hub={this.props.item}/> }/>
        );
    }

    return null;
  },

  render() {
    const { identity } = this.props.item;
    const hubMenu = (
      <ActionMenu 
        location={this.props.location} 
        caption={ identity.name } 
        actions={ HubActions } 
        itemData={ this.props.item } 
        ids={ ["reconnect", "favorite"] }/>
    );

    const icon = (
      <Format.HubIconFormatter size="large" hub={this.props.item} />
    );

    //const subHeader = identity.description;

    return (
      <div className="hub-session session-layout">
        <TabHeader
          icon={icon}
          title={hubMenu}
          closeHandler={this.handleClose}
          subHeader={ identity.description }/>

        { this.getMessage() }
        <MessageView
          messages={this.props.messages}
          handleSend={this.handleSend}
        />
      </div>
    );
  },
});

export default ChatSessionDecorator(HubSession, HubSessionStore, HubMessageStore, HubActions);