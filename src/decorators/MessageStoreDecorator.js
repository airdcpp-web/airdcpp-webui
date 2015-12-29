import update from 'react-addons-update';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

// TODO: remove messages for closed session
export default function (store, actions, sessionStore, access) {
	let messages = {};

	const addMessage = (sessionId, message) => {
		messages[sessionId] = update(messages[sessionId], { $push: [ message ] });
		store.trigger(messages[sessionId], sessionId);
	};

	const onFetchMessagesCompleted = (sessionId, data) => {
		messages[sessionId] = data;
		store.trigger(messages[sessionId], sessionId);
	};

	const onMessageReceived = (sessionId, message, type) => {
		if (!messages[sessionId]) {
			// Don't store messages before the initial fetch has completed
			return;
		}

		// Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
		const sectionMessages = messages[sessionId];
		if (sectionMessages.length > 0) {
			const lastMessage = sectionMessages[sectionMessages.length-1];
			if (lastMessage.chat_message ? lastMessage.chat_message.id >= message.id : lastMessage.log_message.id >= message.id) {
				return;
			}
		}

		// Active tab?
		if (!message.is_read && sessionId === sessionStore.getActiveSession()) {
			message.is_read = true;
		}

		// Message limit exceed?
		if (messages.length > sessionStore.getSession(sessionId).total_messages) {
			messages.shift();
		}

		addMessage(sessionId, { [type]: message });
	};

	store._onChatMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'chat_message');
	};

	store._onStatusMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'log_message');
	};

	store.onSocketDisconnected = () => {
		messages = {};
	};

	store.getMessages = () => messages;

	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
}
