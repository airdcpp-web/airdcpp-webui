import { checkSplice, mergeCacheMessages, pushMessage } from 'utils/MessageUtils';
import SocketSubscriptionDecorator from '../decorators/SocketSubscriptionDecorator';

import * as API from 'types/api';
import { AccessEnum } from 'types/api';
import * as UI from 'types/ui';


type ChatSession = UI.SessionItemBase;

type MessageCache = UI.MessageListItem[];

const MessageStoreDecorator = function (store: any, actions: UI.SessionActions<ChatSession>, access: AccessEnum) {
  // Message arrays mapped by session IDs 
  let messages = new Map();

  // Keep track of session IDs for which message fetching has been initialized
  let initializedSession = new Set<API.IdType>();


  const onFetchMessagesCompleted = (session: UI.SessionItemBase, cacheMessages: MessageCache) => {
    messages.set(session.id, mergeCacheMessages(cacheMessages, messages.get(session.id)));
    store.trigger(messages.get(session.id), session.id);
  };

  const onFetchMessages = (session: UI.SessionItemBase) => {
    initializedSession.add(session.id);
  };

  const onMessageReceived = (sessionId: API.IdType, message: API.Message, type: UI.MessageType) => {
    messages.set(sessionId, pushMessage({ [type]: message } as UI.MessageListItem, messages.get(sessionId)));
    store.trigger(messages.get(sessionId), sessionId);
  };

  const Decorator = {
    _onChatMessage: (data: API.Message, sessionId: API.IdType) => {
      onMessageReceived(sessionId, data, 'chat_message');
    },

    _onStatusMessage: (data: API.Message, sessionId: API.IdType) => {
      onMessageReceived(sessionId, data, 'log_message');
    },

    _onSessionUpdated: (session: Partial<UI.MessageCounts>, sessionId: API.IdType) => {
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
    },

    _onSessionRemoved: (session: ChatSession) => {
      messages.delete(session.id);
      initializedSession.delete(session.id);
    },

    onSocketDisconnected: () => {
      messages.clear();
      initializedSession.clear();
    },

    hasMessages: () => messages.size > 0,
    hasInitializedSessions: () => initializedSession.size > 0,
  
    getSessionMessages: (sessionId: API.IdType) => messages.get(sessionId),
    isSessionInitialized: (sessionId: API.IdType) => initializedSession.has(sessionId),
  };

  store.listenTo(actions.fetchMessages, onFetchMessages);
  store.listenTo((actions.fetchMessages as any).completed, onFetchMessagesCompleted);

  return SocketSubscriptionDecorator(Object.assign(store, Decorator), access);
};

export default MessageStoreDecorator;
