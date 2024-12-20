//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import HubConstants from 'constants/HubConstants';
import HubActions from 'actions/reflux/HubActions';

import MessageStoreDecorator from './decorators/MessageStoreDecorator';

import { SessionScrollPositionKeeper } from './helpers/SessionScrollPositionKeeper';
import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';

import * as API from 'types/api';

const HubMessageStore = Reflux.createStore({
  scroll: SessionScrollPositionKeeper(),

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      !this.hasMessages(),
      'No existing hub messages should exist on socket connect',
    );
    invariant(
      !this.hasInitializedSessions(),
      'No initialized hub sessions should exist on socket connect',
    );

    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.HUB_MESSAGE,
      this._onChatMessage,
    );
    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.HUB_STATUS_MESSAGE,
      this._onStatusMessage,
    );

    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_UPDATED,
      this._onSessionUpdated,
    );
    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_REMOVED,
      this._onSessionRemoved,
    );
  },
});

export default MessageStoreDecorator(
  HubMessageStore,
  HubActions,
  API.AccessEnum.HUBS_VIEW,
);
