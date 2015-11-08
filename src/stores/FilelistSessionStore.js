import Reflux from 'reflux';

import { FILELIST_MODULE_URL, FILELIST_SESSION_CREATED, FILELIST_SESSION_REMOVED, FILELIST_SESSION_UPDATED } from 'constants/FilelistConstants';

import FilelistActions from 'actions/FilelistActions';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from 'decorators/SessionStoreDecorator';

const FilelistStore = Reflux.createStore({
	getInitialState: function () {
		return this.getSessions();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(FILELIST_MODULE_URL, FILELIST_SESSION_CREATED, this._onSessionCreated);
		addSocketListener(FILELIST_MODULE_URL, FILELIST_SESSION_REMOVED, this._onSessionRemoved);
		addSocketListener(FILELIST_MODULE_URL, FILELIST_SESSION_UPDATED, this._onSessionUpdated);
	},
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(FilelistStore), FilelistActions)
;
