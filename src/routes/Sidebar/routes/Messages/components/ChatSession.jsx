'use strict';

import React from 'react';
import Reflux from 'reflux';

import { Link } from 'react-router';

import MessageView from 'routes/Sidebar/components/MessageView'
import SocketService from 'services/SocketService.js'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatMessageStore from 'stores/PrivateChatMessageStore'
import PrivateChatActions from 'actions/PrivateChatActions'

import {PRIVATE_CHAT_SESSION_URL, PRIVATE_CHAT_MESSAGE} from 'constants/PrivateChatConstants';

import { ActionMenu } from 'components/Menu'
import UserActions from 'actions/UserActions'

import '../style.css'

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

const TabHeader = React.createClass({
  render() {
    return (
      <div className="tab-header">
        <h2 className="ui header">
          <i className={ this.props.icon + " icon"}></i>
          <div className="content">
            { this.props.title }
          </div>
        </h2>
        <div className="ui button" onClick={this.props.closeHandler}>
          Close
        </div>
      </div>
    );
  },
});

const TabFooter = React.createClass({
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
});


const ChatSession = React.createClass({
  displayName: "ChatSession",
  mixins: [Reflux.listenTo(PrivateChatMessageStore, "onMessagesChanged")],

  onMessagesChanged(messages, cid) {
    if (cid !== this.props.params.cid) {
      return;
    }

    this.setState({messages: messages});
  },

  getInitialState() {
    return {
      session: null,
      messages: []
    }
  },

  updateSession(cid) {
    PrivateChatActions.sessionChanged(cid);
    PrivateChatActions.setRead(cid);

    PrivateChatActions.fetchMessages(cid);

    this.setState({ session: PrivateChatSessionStore.getSession(cid) });
  },

  componentWillReceiveProps(nextProps) {
    const {cid} = nextProps.params
    if (!this.state.session || this.state.session.user.cid !== cid) {
      this.setState({ messages: [] });

      this.updateSession(cid);
    }
  },

  componentWillMount() {
    this.updateSession(this.props.params.cid);
  },

  _onMessage(data) {
    const messages = React.addons.update(this.state.messages, {$push: [ { chat_message: data }]});
    this.setState({ messages: messages });
  },

  handleClose() {
    PrivateChatActions.removeSession(this.state.session.user.cid);
  },

  handleSend(message) {
    PrivateChatActions.sendMessage(this.state.session.user.cid, message);
  },

  render() {
    if (!this.state.session) {
      return <div className="ui text loader">Loading</div>
    }

    const userMenu = (
      <UserTitleMenu user={ this.state.session.user } location={this.props.location} ids={["browser"]}/>
    );

    return (
      <div className="chat-session">
        <TabHeader
          title={userMenu}
          closeHandler={this.handleClose}
          icon="blue user"/>

        <MessageView
          messages={this.state.messages}
          handleSend={this.handleSend}
        />
      </div>
    );
  },
});

export default ChatSession;