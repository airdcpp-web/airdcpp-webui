//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import HubActions from 'actions/reflux/HubActions';
import HubConstants from 'constants/HubConstants';

import {
  HubMessageNotifyUrgencies,
  HubMessageUrgencies,
} from 'constants/UrgencyConstants';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import AccessConstants from 'constants/AccessConstants';

import * as API from 'types/api';
import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';
import { SessionScrollPositionKeeper } from './helpers/SessionScrollPositionKeeper';

const HubSessionStore = Reflux.createStore({
  scroll: SessionScrollPositionKeeper(),

  getInitialState: function () {
    return this.getSessions();
  },

  hasConnectedHubs() {
    return this.getSessions().find(
      (session: API.Hub) => session.connect_state.id === 'connected'
    );
  },

  getSessionByUrl(hubUrl: string) {
    return this.getSessions().find((session: API.Hub) => session.hub_url === hubUrl);
  },

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      this.getSessions().length === 0,
      'No existing hub sessions should exist on socket connect'
    );

    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_CREATED,
      this._onSessionCreated
    );
    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_REMOVED,
      this._onSessionRemoved
    );
    addSocketListener(
      HubConstants.MODULE_URL,
      HubConstants.SESSION_UPDATED,
      this._onSessionUpdated
    );
  },
});

export default SessionStoreDecorator<API.Hub>(
  SocketSubscriptionDecorator(HubSessionStore, AccessConstants.HUBS_VIEW),
  HubActions,
  (session) =>
    session.settings.use_main_chat_notify
      ? HubMessageNotifyUrgencies
      : HubMessageUrgencies
);
