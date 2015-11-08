import update from 'react-addons-update';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

export default function (store, actions, sessionStore) {
	let messages = {};

	const addMessage = (id, message) => {
		messages[id] = update(messages[id], { $push: [ message ] });
		store.trigger(messages[id], id);
	};

	const onFetchMessagesCompleted = (id, data) => {
		messages[id] = data;
		store.trigger(messages[id], id);
	};

	store._onChatMessage = (data, id) => {
		if (!messages[id]) {
			// Don't store messages before the initial fetch has completed
			return;
		}

		if (!data.is_read && id === sessionStore.getActiveSession()) {
			actions.setRead(id);
			data.is_read = true;
		}

		if (messages.length > store.maxMessages) {
			messages.shift();
		}

		addMessage(id, { chat_message: data });
	};

	store._onStatusMessage = (data, id) => {
		addMessage(id, { log_message: data });
	};

	store.onSocketDisconnected = () => {
		messages = {};
	};

	store.getMessages = () => messages;

	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store);
}
