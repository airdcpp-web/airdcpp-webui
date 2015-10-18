import Reflux from 'reflux';

import {HUB_MODULE_URL, HUB_SESSION_CREATED, HUB_SESSION_REMOVED, HUB_SESSION_UPDATED} from 'constants/HubConstants';

import HubActions from 'actions/HubActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'
import SessionStoreDecorator from 'decorators/SessionStoreDecorator'

const HubSessionStore = Reflux.createStore({
  getInitialState: function() {
      return this.getSessions();
  },

  hasConnectedHubs() {
  	return this.getSessions().find(session => session.connect_state.id === "connected");
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(HUB_MODULE_URL, HUB_SESSION_CREATED, this._onSessionCreated);
    addSocketListener(HUB_MODULE_URL, HUB_SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(HUB_MODULE_URL, HUB_SESSION_UPDATED, this._onSessionUpdated);
  },
});


export default SessionStoreDecorator(SocketSubscriptionDecorator(HubSessionStore), HubActions.fetchSessions.completed)