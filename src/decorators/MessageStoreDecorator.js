import update from 'react-addons-update';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// TODO: remove messages for closed session
export default function (store, actions, sessionStore, access) {
	let messages = {};

	const addMessage = (id, message) => {
		messages[id] = update(messages[id], { $push: [ message ] });
		store.trigger(messages[id], id);
	};

	const onFetchMessagesCompleted = (id, data) => {
		messages[id] = data;
		store.trigger(messages[id], id);
	};

	const onMessageReceived = (id, message, type) => {
		if (!messages[id]) {
			// Don't store messages before the initial fetch has completed
			return;
		}

		// Active tab?
		if (!message.is_read && id === sessionStore.getActiveSession()) {
			message.is_read = true;
		}

		// Message limit exceed?
		if (messages.length > 100) {
			messages.shift();
		}

		addMessage(id, { [type]: message });
	};

	store._onChatMessage = (data, id) => {
		onMessageReceived(id, data, 'chat_message');
	};

	store._onStatusMessage = (data, id) => {
		onMessageReceived(id, data, 'log_message');
	};

	store.onSocketDisconnected = () => {
		messages = {};
	};

	store.getMessages = () => messages;

	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
}
