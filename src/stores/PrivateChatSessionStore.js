import Reflux from 'reflux';

import {PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREATED, CHAT_SESSION_REMOVED, CHAT_SESSION_UPDATED} from 'constants/PrivateChatConstants';

import PrivateChatActions from 'actions/PrivateChatActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'
import SessionStoreDecorator from 'decorators/SessionStoreDecorator'

const ChatSessionStore = Reflux.createStore({
  getInitialState: function() {
      return this.getSessions();
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_CREATED, this._onSessionCreated);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, CHAT_SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(ChatSessionStore), PrivateChatActions.fetchSessions.completed)