import Reflux from 'reflux';
import React from 'react';

import {PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREADED, CHAT_SESSION_REMOVED, CHAT_SESSION_UPDATED} from 'constants/PrivateChatConstants';

import PrivateChatActions from 'actions/PrivateChatActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'

const ChatSessionStore = Reflux.createStore({
  listenables: PrivateChatActions,
  init: function() {
    this._chatSessions = [];
  },

  getInitialState: function() {
      return this._chatSessions;
  },

  onFetchSessionsCompleted: function(data) {
    this._chatSessions = data;
    this.trigger(this._chatSessions);
  },

  countUnreadSessions() {
    return this._chatSessions.reduce((count, session) => session.unread_count > 0 ? count + 1 : count, 0);
  },

  getSession(cid) {
    return this._chatSessions.find(session => session.user.cid == cid);
  },

  _onSessionCreated(data) {
    this._chatSessions = React.addons.update(this._chatSessions, {$push: [data]});
    this.trigger(this._chatSessions);
  },

  _onSessionUpdated(data, id) {
    const session = this.getSession(id);
    this._chatSessions[this._chatSessions.indexOf(session)] = React.addons.update(session, {$merge: data});
    this.trigger(this._chatSessions);
  },

  _onSessionRemoved(data) {
    const index = this._chatSessions.indexOf(this.getSession(data.cid));
    this._chatSessions = React.addons.update(this._chatSessions, {$splice: [[index, 1]]});
    this.trigger(this._chatSessions);
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREADED, this._onSessionCreated);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_UPDATED, this._onSessionUpdated);
  },
});


export default SocketSubscriptionDecorator(ChatSessionStore)