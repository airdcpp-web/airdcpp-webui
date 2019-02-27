import Reflux from 'reflux';
import invariant from 'invariant';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import { PrivateMessageUrgencies } from 'constants/UrgencyConstants';
import AccessConstants from 'constants/AccessConstants';


const PrivateChatSessionStore = Reflux.createStore({
  getInitialState: function () {
    return this.getSessions();
  },

  onSocketConnected(addSocketListener) {
    invariant(this.getSessions().length === 0, 'No existing private chat sessions should exist on socket connect');

    const url = PrivateChatConstants.MODULE_URL;
    addSocketListener(url, PrivateChatConstants.SESSION_CREATED, this._onSessionCreated);
    addSocketListener(url, PrivateChatConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, PrivateChatConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(PrivateChatSessionStore, AccessConstants.PRIVATE_CHAT_VIEW), PrivateChatActions, PrivateMessageUrgencies)
;
