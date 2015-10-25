import Reflux from 'reflux';

import {HUB_MODULE_URL, HUB_CHAT_MESSAGE, HUB_STATUS_MESSAGE} from 'constants/HubConstants';
import HubActions from 'actions/HubActions'

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator'
import MessageStoreDecorator from 'decorators/MessageStoreDecorator'

const HubMessageStore = Reflux.createStore({
	getInitialState: function() {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(HUB_MODULE_URL, HUB_CHAT_MESSAGE, this._onChatMessage);
		addSocketListener(HUB_MODULE_URL, HUB_STATUS_MESSAGE, this._onStatusMessage);
	},
});


export default MessageStoreDecorator(SocketSubscriptionDecorator(HubMessageStore), HubActions)