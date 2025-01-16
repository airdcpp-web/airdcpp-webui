//@ts-ignore
import Reflux from 'reflux';
import invariant from 'invariant';

import FilelistConstants from 'constants/FilelistConstants';
import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';

import SocketSubscriptionDecorator from '../decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from '../decorators/SessionStoreDecorator';

import { AddSocketListener } from 'decorators/SocketSubscriptionDecorator';
import { BrowserSessionScrollPositionKeeper } from '../helpers/SessionScrollPositionKeeper';

import * as API from 'types/api';

const FilelistSessionStore = Reflux.createStore({
  scroll: BrowserSessionScrollPositionKeeper(),

  getInitialState() {
    return this.getSessions();
  },

  onSocketConnected(addSocketListener: AddSocketListener) {
    invariant(
      this.getSessions().length === 0,
      'No existing filelist sessions should exist on socket connect',
    );

    const url = FilelistConstants.MODULE_URL;
    addSocketListener(url, FilelistConstants.SESSION_CREATED, this._onSessionCreated);
    addSocketListener(url, FilelistConstants.SESSION_REMOVED, this._onSessionRemoved);
    addSocketListener(url, FilelistConstants.SESSION_UPDATED, this._onSessionUpdated);
  },
});

export default SessionStoreDecorator(
  SocketSubscriptionDecorator(FilelistSessionStore, API.AccessEnum.FILELISTS_VIEW),
  FilelistSessionActions,
);
