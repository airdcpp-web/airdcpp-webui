import Reflux from 'reflux';
import invariant from 'invariant';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/PrivateChatActions';

import MessageStoreDecorator from './decorators/MessageStoreDecorator';

import AccessConstants from 'constants/AccessConstants';


const PrivateChatMessageStore = Reflux.createStore({
  onSocketConnected(addSocketListener) {
    invariant(!this.hasMessages(), 'No existing private messages should exist on socket connect');
    invariant(!this.hasInitializedSessions(), 'No initialized private message sessions should exist on socket connect');

    const url = PrivateChatConstants.MODULE_URL;
    addSocketListener(url, PrivateChatConstants.MESSAGE, this._onChatMessage);
    addSocketListener(url, PrivateChatConstants.STATUS, this._onStatusMessage);

    addSocketListener(url, PrivateChatConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, PrivateChatConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default MessageStoreDecorator(PrivateChatMessageStore, PrivateChatActions, AccessConstants.PRIVATE_CHAT_VIEW)
;
