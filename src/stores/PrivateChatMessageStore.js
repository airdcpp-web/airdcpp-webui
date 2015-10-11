import Reflux from 'reflux';
import React from 'react';

import {PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, PRIVATE_CHAT_STATUS} from 'constants/PrivateChatConstants';

import PrivateChatActions from 'actions/PrivateChatActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'

const PrivateChatMessageStore = Reflux.createStore({
  listenables: PrivateChatActions,
  init: function() {
    this._messages = {};
    this._activeSession = null;
  },

  getInitialState: function() {
    return this._messages;
  },

  onFetchMessagesCompleted: function(cid, data) {
    this._messages[cid] = data;
    this.trigger(this._messages[cid], cid);
  },

  onSessionChanged(cid) {
    this._activeSession = cid;
  },

  _onChatMessage(data, cid) {
    if (!data.is_read && cid === this._activeSession) {
      PrivateChatActions.setRead(cid);
      data.is_read = true;
    }

    this._addMessage(cid, { chat_message: data });
  },

  _onStatusMessage(data, cid) {
    this._addMessage(cid, { status_message: data });
  },

  _addMessage(cid, message) {
    let userMessages = this._messages[cid] || [];
    this._messages[cid] = React.addons.update(userMessages, {$push: [ message ]});
    this.trigger(this._messages[cid], cid);
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, this._onChatMessage);
    addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_STATUS, this._onStatusMessage);
  },
});


export default SocketSubscriptionDecorator(PrivateChatMessageStore)