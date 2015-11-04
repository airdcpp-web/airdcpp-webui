import Reflux from 'reflux';

import { PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, PRIVATE_CHAT_STATUS, MAX_PRIVATE_CHAT_MESSAGES } from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/PrivateChatActions';

import MessageStoreDecorator from 'decorators/MessageStoreDecorator';

const PrivateChatMessageStore = Reflux.createStore({
	getInitialState: function () {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, this._onChatMessage);
		addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_STATUS, this._onStatusMessage);
	},

	get maxMessages() {
		return MAX_PRIVATE_CHAT_MESSAGES;
	}
});

export default MessageStoreDecorator(PrivateChatMessageStore, PrivateChatActions)
;
