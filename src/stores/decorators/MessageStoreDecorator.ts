import { checkSplice, mergeCacheMessages, pushMessage } from 'utils/MessageUtils';
import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

import * as API from 'types/api';
import { AccessEnum } from 'types/api';
//import * as UI from 'types/ui';


type MessageType = 'chat_message' | 'log_message';

interface ChatSession {
  id: API.IdType;
  message_counts: API.ChatMessageCounts;
}

type MessageCache = Array<{ 
  [key in MessageType]: any 
}>;

const MessageStoreDecorator = function (store: any, actions: any, access: AccessEnum) {
  // Message arrays mapped by session IDs 
  let messages = new Map();

  // Keep track of session IDs for which message fetching has been initialized
  let initializedSession = new Set();


  const onFetchMessagesCompleted = (sessionId: API.IdType, cacheMessages: MessageCache) => {
    messages.set(sessionId, mergeCacheMessages(cacheMessages, messages.get(sessionId)));
    store.trigger(messages.get(sessionId), sessionId);
  };

  const onFetchMessages = (sessionId: API.IdType) => {
    initializedSession.add(sessionId);
  };

  const onMessageReceived = (sessionId: API.IdType, message: API.Message, type: MessageType) => {
    messages.set(sessionId, pushMessage({ [type]: message }, messages.get(sessionId)));
    store.trigger(messages.get(sessionId), sessionId);
  };

  store._onChatMessage = (data: API.Message, sessionId: API.IdType) => {
    onMessageReceived(sessionId, data, 'chat_message');
  };

  store._onStatusMessage = (data: API.Message, sessionId: API.IdType) => {
    onMessageReceived(sessionId, data, 'log_message');
  };

  store._onSessionUpdated = (session: ChatSession, sessionId: API.IdType) => {
    if (!session.message_counts || !messages.get(sessionId)) {
      return;
    }

    // Message limit exceed or messages were cleared?
    const splicedMessages = checkSplice(messages.get(sessionId), session.message_counts.total);

    // Don't update the messages if nothing has changed
    // Session is updated when it's marked as read, which may happen simultaneously with the initial fetch. 
    // Triggering an update would cause an incomplete message log being flashed to the user
    if (splicedMessages !== messages.get(sessionId)) {
      messages.set(sessionId, splicedMessages);
      store.trigger(splicedMessages, sessionId);
    }
  };

  store._onSessionRemoved = (session: ChatSession) => {
    messages.delete(session.id);
    initializedSession.delete(session.id);
  };

  store.onSocketDisconnected = () => {
    messages.clear();
    initializedSession.clear();
  };

  store.hasMessages = () => messages.size > 0;
  store.hasInitializedSessions = () => initializedSession.size > 0;


  store.getSessionMessages = (sessionId: API.IdType) => messages.get(sessionId);
  store.isSessionInitialized = (sessionId: API.IdType) => initializedSession.has(sessionId);

  store.listenTo(actions.fetchMessages, onFetchMessages);
  store.listenTo(actions.fetchMessages.completed, onFetchMessagesCompleted);
  return SocketSubscriptionDecorator(store, access);
};

export default MessageStoreDecorator;
