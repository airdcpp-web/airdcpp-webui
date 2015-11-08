import Reflux from 'reflux';

import { HUB_MODULE_URL, HUB_CHAT_MESSAGE, HUB_STATUS_MESSAGE, MAX_HUB_CHAT_MESSAGES } from 'constants/HubConstants';
import HubActions from 'actions/HubActions';

import MessageStoreDecorator from 'decorators/MessageStoreDecorator';
import HubSessionStore from 'stores/HubSessionStore';

const HubMessageStore = Reflux.createStore({
	getInitialState: function () {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(HUB_MODULE_URL, HUB_CHAT_MESSAGE, this._onChatMessage);
		addSocketListener(HUB_MODULE_URL, HUB_STATUS_MESSAGE, this._onStatusMessage);
	},

	get maxMessages() {
		return MAX_HUB_CHAT_MESSAGES;
	}
});


export default MessageStoreDecorator(HubMessageStore, HubActions, HubSessionStore)
;
