//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import { ChatroomUrgencies, PrivateMessageUrgencies } from 'constants/UrgencyConstants';
import AccessConstants from 'constants/AccessConstants';

import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';
import * as API from 'types/api';

const PrivateChatSessionStore = Reflux.createStore({
  getInitialState: function () {
    return this.getSessions();
  },

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      this.getSessions().length === 0,
      'No existing private chat sessions should exist on socket connect',
    );

    const url = PrivateChatConstants.MODULE_URL;
    addSocketListener(url, PrivateChatConstants.SESSION_CREATED, this._onSessionCreated);
    addSocketListener(url, PrivateChatConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, PrivateChatConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default SessionStoreDecorator<API.PrivateChat>(
  SocketSubscriptionDecorator(PrivateChatSessionStore, AccessConstants.PRIVATE_CHAT_VIEW),
  PrivateChatActions,
  (session) =>
    session.user.flags.includes('bot') ? ChatroomUrgencies : PrivateMessageUrgencies,
);
