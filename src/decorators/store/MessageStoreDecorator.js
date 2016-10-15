import update from 'react-addons-update';

import MessageUtils from 'utils/MessageUtils';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';


const filterListed = (messageList, message) => {
	const id = MessageUtils.getListMessageId(message);
	return !messageList.find(existingMessage => MessageUtils.getListMessageId(existingMessage) === id);
};

export default function (store, actions, sessionStore, access) {
	// Message arrays mapped by session IDs 
	let messages = {};

	const addMessage = (sessionId, message) => {
		messages[sessionId] = update(messages[sessionId], { $push: [ message ] });
		store.trigger(messages[sessionId], sessionId);
	};

	const onFetchMessagesCompleted = (sessionId, cacheMessages) => {
		if (!messages[sessionId]) {
			messages[sessionId] = cacheMessages;
		} else {
			// Messages were received via listener while fetching cached ones
			// Append the received non-dupe messages to fetched list
			messages[sessionId] = [
				...cacheMessages,
				...messages[sessionId].filter(filterListed.bind(this, cacheMessages)),
			];
		}
		
		store.trigger(messages[sessionId], sessionId);
	};

	const onMessageReceived = (sessionId, message, type) => {
		// In case fetching hasn't finished yet
		if (!messages[sessionId]) {
			messages[sessionId] = [];
		}

		// Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
		const sectionMessages = messages[sessionId];
		if (sectionMessages.length > 0) {
			const lastMessage = sectionMessages[sectionMessages.length-1];
			if (MessageUtils.getListMessageId(lastMessage) >= message.id) {
				return;
			}
		}

		// Active tab?
		if (!message.is_read && sessionId === sessionStore.getActiveSession()) {
			message = {
				...message,
				is_read: true,
			};
		}

		addMessage(sessionId, { [type]: message });
	};

	store._onChatMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'chat_message');
	};

	store._onStatusMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'log_message');
	};

	store._onSessionUpdated = (session, sessionId) => {
		// Message limit exceed or messages were cleared?
		messages[sessionId] = MessageUtils.checkSplice(messages[sessionId], session.total_messages);
		store.trigger(messages[sessionId], sessionId);
	};

	store._onSessionRemoved = (session) => {
		delete messages[session.id];
	};

	store.onSocketDisconnected = () => {
		messages = {};
	};

	store.getMessages = () => messages;
	store.getSessionMessages = (sessionId) => messages[sessionId];

	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
}
