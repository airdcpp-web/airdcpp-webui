import Reflux from 'reflux';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/PrivateChatActions';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from 'decorators/store/SessionStoreDecorator';

import { PrivateMessageUrgencies } from 'constants/UrgencyConstants';
import AccessConstants from 'constants/AccessConstants';


const PrivateChatSessionStore = Reflux.createStore({
	getInitialState: function () {
		return this.getSessions();
	},

	onSocketConnected(addSocketListener) {
		const url = PrivateChatConstants.MODULE_URL;
		addSocketListener(url, PrivateChatConstants.SESSION_CREATED, this._onSessionCreated);
		addSocketListener(url, PrivateChatConstants.SESSION_REMOVED, this._onSessionRemoved);
		addSocketListener(url, PrivateChatConstants.SESSION_UPDATED, this._onSessionUpdated);
	},
});

export default SessionStoreDecorator(SocketSubscriptionDecorator(PrivateChatSessionStore, AccessConstants.PRIVATE_CHAT_VIEW), PrivateChatActions, PrivateMessageUrgencies)
;
