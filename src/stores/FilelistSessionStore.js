import Reflux from 'reflux';
import invariant from 'invariant';

import FilelistConstants from 'constants/FilelistConstants';
import FilelistActions from 'actions/FilelistActions';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import AccessConstants from 'constants/AccessConstants';


const FilelistSessionStore = Reflux.createStore({
	getInitialState() {
		return this.getSessions();
	},

	onSocketConnected(addSocketListener) {
		invariant(this.getSessions().length === 0, 'No existing filelist sessions should exist on socket connect');

		const url = FilelistConstants.MODULE_URL;
		addSocketListener(url, FilelistConstants.SESSION_CREATED, this._onSessionCreated);
		addSocketListener(url, FilelistConstants.SESSION_REMOVED, this._onSessionRemoved);
		addSocketListener(url, FilelistConstants.SESSION_UPDATED, this._onSessionUpdated);
	},
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(FilelistSessionStore, AccessConstants.FILELISTS_VIEW), FilelistActions)
;
