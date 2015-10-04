import Reflux from 'reflux';

import {PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREADED, CHAT_SESSION_REMOVED, CHAT_SESSION_UPDATED} from 'constants/PrivateChatConstants';

import SocketStore from './SocketStore'
import PrivateChatActions from 'actions/PrivateChatActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'

const ChatSessionStore = Reflux.createStore({
  listenables: PrivateChatActions,
  init: function() {
    this._sessions = [];
  },

  onFetchSessionsCompleted: function(data) {
    this.sessions = data;
    this.trigger(this._sessions);
  },

  _findSession(data) {
    return this._sessions.find(session => session.cid == data.cid);
  },

  _onSessionCreated(data) {
    this._sessions.push(data);
    this.trigger(this._sessions);
  },

  _onSessionUpdated(data) {
    let session = this._findSession(data);
    this._sessions[session] = data;
    this.trigger(this._sessions);
  },

  _onSessionRemoved(data) {
    array.splice(this._findSession(data), 1);
    this.trigger(this._sessions);
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREADED, this._onSessionCreated);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_REMOVED, this._onSessionUpdated);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_UPDATED, this._onSessionRemoved);
  },
});


export default SocketSubscriptionDecorator(ChatSessionStore)