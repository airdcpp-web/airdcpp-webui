'use strict';

import React from 'react';

import { Link } from 'react-router';

import MessageView from 'routes/Sidebar/components/MessageView'
import SocketService from 'services/SocketService.js'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'

import {PRIVATE_CHAT_SESSION_URL, PRIVATE_CHAT_MESSAGE} from 'constants/PrivateChatConstants';

//import '../style.css'
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin'

const ChatSession = React.createClass({
  displayName: "ChatSession",
  mixins: [SocketSubscriptionMixin],

  getInitialState() {
    return {
      session: null,
      messages: []
    }
  },

  updateSession(cid) {
    this.setState({ session: PrivateChatSessionStore.getSession(cid) });

    PrivateChatActions.setRead(cid);

    SocketService.get(PRIVATE_CHAT_SESSION_URL + '/' + cid + '/messages/' + 200)
      .then(data => {
        this.setState({ messages: data });
      })
      .catch(error => 
        console.log("Failed to fetch messages: " + error)
      );
  },

  componentWillReceiveProps(nextProps) {
    const {cid} = nextProps.params
    if (!this.state.session || this.state.session.user.cid !== cid) {
      this.removeSocketListeners();
      this.onSocketConnected();

      this.updateSession(cid);
    }
  },

  componentWillMount() {
    this.updateSession(this.props.params.cid);
  },

  _onMessage(data) {
    const messages = React.update(this.state.messages, {$push: [data]});
    this.setState({ messages: messages });
  },

  onSocketConnected() {
    this.addSocketListener(PRIVATE_CHAT_SESSION_URL + '/' + this.props.params.cid, PRIVATE_CHAT_MESSAGE, this._onMessage);
  },

  render() {
    return (
      <div>
      <MessageView>

      </MessageView>
      <div>
        SESSION
      </div>
      </div>
    );
  },
});

export default ChatSession;