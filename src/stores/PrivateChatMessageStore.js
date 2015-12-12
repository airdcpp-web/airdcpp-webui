import Reflux from 'reflux';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import PrivateChatActions from 'actions/PrivateChatActions';

import MessageStoreDecorator from 'decorators/MessageStoreDecorator';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

const PrivateChatMessageStore = Reflux.createStore({
	getInitialState: function () {
		return this.getMessages();
	},

	onSocketConnected(addSocketListener) {
		const url = PrivateChatConstants.MODULE_URL;
		addSocketListener(url, PrivateChatConstants.MESSAGE, this._onChatMessage);
		addSocketListener(url, PrivateChatConstants.STATUS, this._onStatusMessage);
	},

	get maxMessages() {
		return PrivateChatConstants.MAX_MESSAGES;
	}
});

export default MessageStoreDecorator(PrivateChatMessageStore, PrivateChatActions, PrivateChatSessionStore)
;
