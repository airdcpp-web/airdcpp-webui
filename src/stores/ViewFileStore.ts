//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import ViewFileConstants from 'constants/ViewFileConstants';
import ViewFileActions from 'actions/reflux/ViewFileActions';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';
import { SessionScrollPositionKeeper } from './helpers/SessionScrollPositionKeeper';

import * as API from 'types/api';

const ViewFileSessionStore = Reflux.createStore({
  scroll: SessionScrollPositionKeeper(),

  getInitialState() {
    return this.getSessions();
  },

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      this.getSessions().length === 0,
      'No viewed files should exist on socket connect',
    );

    const url = ViewFileConstants.MODULE_URL;
    addSocketListener(url, ViewFileConstants.SESSION_CREATED, this._onSessionCreated);
    addSocketListener(url, ViewFileConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, ViewFileConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default SessionStoreDecorator(
  SocketSubscriptionDecorator(ViewFileSessionStore, API.AccessEnum.VIEW_FILE_VIEW),
  ViewFileActions,
);
