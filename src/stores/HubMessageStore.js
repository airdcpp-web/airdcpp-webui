import Reflux from 'reflux';

import HubConstants from 'constants/HubConstants';
import HubActions from 'actions/HubActions';

import MessageStoreDecorator from 'decorators/store/MessageStoreDecorator';
import HubSessionStore from 'stores/HubSessionStore';

import AccessConstants from 'constants/AccessConstants';


const HubMessageStore = Reflux.createStore({
	getInitialState: function () {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(HubConstants.MODULE_URL, HubConstants.HUB_MESSAGE, this._onChatMessage);
		addSocketListener(HubConstants.MODULE_URL, HubConstants.HUB_STATUS_MESSAGE, this._onStatusMessage);
		addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_REMOVED, this._onSessionRemoved);
	},
});

export default MessageStoreDecorator(HubMessageStore, HubActions, HubSessionStore, AccessConstants.HUBS_VIEW)
;
