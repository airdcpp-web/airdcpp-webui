import MessageUtils from 'utils/MessageUtils';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';


export default function (store, actions, access) {
	// Message arrays mapped by session IDs 
	let messages = {};

	const onFetchMessagesCompleted = (sessionId, cacheMessages) => {
		messages[sessionId] = MessageUtils.mergeCacheMessages(cacheMessages, messages[sessionId]);
		store.trigger(messages[sessionId], sessionId);
	};

	const onMessageReceived = (sessionId, message, type) => {
		messages[sessionId] = MessageUtils.pushMessage({ [type]: message }, messages[sessionId]);
		store.trigger(messages[sessionId], sessionId);
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
	store.getSessionMessages = sessionId => messages[sessionId];

	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
}
