import MessageUtils from 'utils/MessageUtils';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';


const MessageStoreDecorator = function (store, actions, access) {
	// Message arrays mapped by session IDs 
	let messages = new Map();

	// Keep track of session IDs for which message fetching has been initialized
	let initializedSession = new Set();


	const onFetchMessagesCompleted = (sessionId, cacheMessages) => {
		messages.set(sessionId, MessageUtils.mergeCacheMessages(cacheMessages, messages.get(sessionId)));
		store.trigger(messages.get(sessionId), sessionId);
	};

	const onFetchMessages = (sessionId) => {
		initializedSession.add(sessionId);
	};

	const onMessageReceived = (sessionId, message, type) => {
		messages.set(sessionId, MessageUtils.pushMessage({ [type]: message }, messages.get(sessionId)));
		store.trigger(messages.get(sessionId), sessionId);
	};

	store._onChatMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'chat_message');
	};

	store._onStatusMessage = (data, sessionId) => {
		onMessageReceived(sessionId, data, 'log_message');
	};

	store._onSessionUpdated = (session, sessionId) => {
		// Message limit exceed or messages were cleared?
		messages.set(sessionId, MessageUtils.checkSplice(messages.get(sessionId), session.total_messages));
		store.trigger(messages.get(sessionId), sessionId);
	};

	store._onSessionRemoved = (session) => {
		messages.delete(session.id);
		initializedSession.delete(session.id);
	};

	store.onSocketDisconnected = () => {
		messages.clear();
		initializedSession.clear();
	};

	store.getSessionMessages = sessionId => messages.get(sessionId);
	store.isSessionInitialized = sessionId => initializedSession.has(sessionId);

	store.listenTo(actions.fetchMessages, onFetchMessages);
	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
};

export default MessageStoreDecorator;
