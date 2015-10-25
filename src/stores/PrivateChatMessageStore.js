import Reflux from 'reflux';

import {PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, PRIVATE_CHAT_STATUS} from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/PrivateChatActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'
import MessageStoreDecorator from 'decorators/MessageStoreDecorator'

const PrivateChatMessageStore = Reflux.createStore({
	getInitialState: function() {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_MESSAGE, this._onChatMessage);
		addSocketListener(PRIVATE_CHAT_MODULE_URL, PRIVATE_CHAT_STATUS, this._onStatusMessage);
	},
});


export default MessageStoreDecorator(SocketSubscriptionDecorator(PrivateChatMessageStore), PrivateChatActions)