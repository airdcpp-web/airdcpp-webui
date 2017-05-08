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
		if (!session.message_counts || !messages.get(sessionId)) {
			return;
		}

		// Message limit exceed or messages were cleared?
		const splicedMessages = MessageUtils.checkSplice(messages.get(sessionId), session.message_counts.total);

		// Don't update the messages if nothing has changed
		// Session is updated when it's marked as read, which may happen simultaneously with the initial fetch. 
		// Triggering an update would cause an incomplete message log being flashed to the user
		if (splicedMessages !== messages.get(sessionId)) {
			messages.set(sessionId, splicedMessages);
			store.trigger(splicedMessages, sessionId);
		}
	};

	store._onSessionRemoved = (session) => {
		messages.delete(session.id);
		initializedSession.delete(session.id);
	};

	store.onSocketDisconnected = () => {
		messages.clear();
		initializedSession.clear();
	};

	store.hasMessages = _ => messages.size > 0;
	store.hasInitializedSessions = _ => initializedSession.size > 0;


	store.getSessionMessages = sessionId => messages.get(sessionId);
	store.isSessionInitialized = sessionId => initializedSession.has(sessionId);

	store.listenTo(actions.fetchMessages, onFetchMessages);
	store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
	return SocketSubscriptionDecorator(store, access);
};

export default MessageStoreDecorator;
