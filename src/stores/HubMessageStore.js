import Reflux from 'reflux';

import HubConstants from 'constants/HubConstants';
import HubActions from 'actions/HubActions';

import MessageStoreDecorator from 'decorators/MessageStoreDecorator';
import HubSessionStore from 'stores/HubSessionStore';

const HubMessageStore = Reflux.createStore({
	getInitialState: function () {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(HubConstants.HUB_MODULE_URL, HubConstants.HUB_MESSAGE, this._onChatMessage);
		addSocketListener(HubConstants.HUB_MODULE_URL, HubConstants.HUB_STATUS_MESSAGE, this._onStatusMessage);
	},

	get maxMessages() {
		return HubConstants.MAX_HUB_MESSAGES;
	}
});


export default MessageStoreDecorator(HubMessageStore, HubActions, HubSessionStore)
;
