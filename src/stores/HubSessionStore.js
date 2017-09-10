import Reflux from 'reflux';
import invariant from 'invariant';

import HubActions from 'actions/HubActions';
import HubConstants from 'constants/HubConstants';

import { HubMessageUrgencies } from 'constants/UrgencyConstants';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import AccessConstants from 'constants/AccessConstants';


const HubSessionStore = Reflux.createStore({
  getInitialState: function () {
    return this.getSessions();
  },

  hasConnectedHubs() {
    return this.getSessions().find(session => session.connect_state.id === 'connected');
  },

  getSessionByUrl(hubUrl) {
    return this.getSessions().find(session => session.hub_url === hubUrl); 
  },

  onSocketConnected(addSocketListener) {
    invariant(this.getSessions().length === 0, 'No existing hub sessions should exist on socket connect');

    addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_CREATED, this._onSessionCreated);
    addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});


export default SessionStoreDecorator(SocketSubscriptionDecorator(HubSessionStore, AccessConstants.HUBS_VIEW), HubActions, HubMessageUrgencies)
;
