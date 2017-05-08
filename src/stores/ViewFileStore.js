import Reflux from 'reflux';
import invariant from 'invariant';

import ViewFileConstants from 'constants/ViewFileConstants';
import ViewFileActions from 'actions/ViewFileActions';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from './decorators/SessionStoreDecorator';

import AccessConstants from 'constants/AccessConstants';


const ViewFileSessionStore = Reflux.createStore({
	getInitialState() {
		return this.getSessions();
	},

	onSocketConnected(addSocketListener) {
		invariant(this.getSessions().length === 0, 'No viewed files should exist on socket connect');

		const url = ViewFileConstants.MODULE_URL;
		addSocketListener(url, ViewFileConstants.SESSION_CREATED, this._onSessionCreated);
		addSocketListener(url, ViewFileConstants.SESSION_REMOVED, this._onSessionRemoved);
		addSocketListener(url, ViewFileConstants.SESSION_UPDATED, this._onSessionUpdated);
	},
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(ViewFileSessionStore, AccessConstants.VIEW_FILE_VIEW), ViewFileActions)
;
