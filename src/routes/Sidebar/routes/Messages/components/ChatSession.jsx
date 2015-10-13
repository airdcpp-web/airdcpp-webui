'use strict';

import React from 'react';

import MessageView from 'routes/Sidebar/components/MessageView'
import SocketService from 'services/SocketService.js'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatMessageStore from 'stores/PrivateChatMessageStore'
import PrivateChatActions from 'actions/PrivateChatActions'

import { ActionMenu } from 'components/Menu'
import UserActions from 'actions/UserActions'

import TabHeader from 'routes/Sidebar/components/TabHeader'
import ChatSessionDecorator from 'decorators/ChatSessionDecorator'
import Format from 'utils/Format'

const UserTitleMenu = React.createClass({
  propTypes: {
    /**
     * Hinted user
     */
    user: React.PropTypes.shape({
      cid: React.PropTypes.string,
      hub_url: React.PropTypes.string
    }).isRequired,

    /**
     * Router location
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Action ids to filter from all actions
     */
    ids: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      ids: null
    }
  },

  render: function() {
    const { user, ...other } = this.props;
    const data = {
      user: user,
      directory: '/'
    }

    return <ActionMenu { ...other } caption={ this.props.user.nicks } actions={ UserActions } itemData={ data }/>;
  }
});

/*const TabFooter = React.createClass({
  render() {
    return (
      <div>
      <div className="ui grid">
        <div className="row">
          <div className="ui list">
            <div className="item">
              <i className="ui icon yellow lock"></i>
              <div className="content">
                <div className="header">Enryption</div>
                <div class="description">
                  Messages are transferred through a direct enrypted channel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  },
});*/


const ChatSession = React.createClass({
  displayName: "ChatSession",
  handleClose() {
    PrivateChatActions.removeSession(this.props.item.id);
  },

  handleSend(message) {
    PrivateChatActions.sendMessage(this.props.item.id, message);
  },

  render() {
    const { user } = this.props.item;
    const userMenu = (
      <UserTitleMenu user={ user } location={this.props.location} ids={["browser"]}/>
    );

    const icon = (
      <Format.UserIconFormatter size="large" flags={user.flags} />
    );

    return (
      <div className="chat-session session-layout">
        <TabHeader
          icon={icon}
          title={userMenu}
          closeHandler={this.handleClose}
          subHeader={ user.hub_names }/>

        <MessageView
          messages={this.props.messages}
          handleSend={this.handleSend}
        />
      </div>
    );
  },
});

export default ChatSessionDecorator(ChatSession, PrivateChatSessionStore, PrivateChatMessageStore, PrivateChatActions);