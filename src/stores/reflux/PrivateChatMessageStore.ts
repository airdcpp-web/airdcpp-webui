//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';

import MessageStoreDecorator from '../decorators/MessageStoreDecorator';

import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';
import { SessionScrollPositionKeeper } from '../helpers/SessionScrollPositionKeeper';

import * as API from 'types/api';

const PrivateChatMessageStore = Reflux.createStore({
  scroll: SessionScrollPositionKeeper(),

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      !this.hasMessages(),
      'No existing private messages should exist on socket connect',
    );
    invariant(
      !this.hasInitializedSessions(),
      'No initialized private message sessions should exist on socket connect',
    );

    const url = PrivateChatConstants.MODULE_URL;
    addSocketListener(url, PrivateChatConstants.MESSAGE, this._onChatMessage);
    addSocketListener(url, PrivateChatConstants.STATUS, this._onStatusMessage);

    addSocketListener(url, PrivateChatConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, PrivateChatConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default MessageStoreDecorator(
  PrivateChatMessageStore,
  PrivateChatActions,
  API.AccessEnum.PRIVATE_CHAT_VIEW,
);
