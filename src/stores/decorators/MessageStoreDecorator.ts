import { checkSplice, mergeCacheMessages, pushMessage } from 'utils/MessageUtils';
import SocketSubscriptionDecorator from '../decorators/SocketSubscriptionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

type ChatSession = UI.SessionItemBase;

type MessageCache = UI.MessageListItem[];

const MessageStoreDecorator = function (
  store: any,
  actions: UI.RefluxActionListType<ChatSession>,
  access: string,
) {
  // Message arrays mapped by session IDs
  const messages = new Map<API.IdType, UI.MessageListItem[]>();

  // Keep track of session IDs for which message fetching has been initialized
  const initializedSession = new Set<API.IdType>();

  const onFetchMessagesCompleted = (
    session: UI.SessionItemBase,
    cacheMessages: MessageCache,
  ) => {
    messages.set(session.id, mergeCacheMessages(cacheMessages, messages.get(session.id)));
    store.trigger(messages.get(session.id), session.id);
  };

  const onFetchMessages = (session: UI.SessionItemBase) => {
    initializedSession.add(session.id);
  };

  const onMessageReceived = (
    sessionId: API.IdType,
    message: API.Message,
    type: UI.MessageType,
  ) => {
    messages.set(
      sessionId,
      pushMessage(
        {
          [type]: message,
        } as UI.MessageListItem,
        messages.get(sessionId),
      ),
    );
    store.trigger(messages.get(sessionId), sessionId);
  };

  const DecoratorPublic: UI.MessageStore = {
    hasMessages: () => messages.size > 0,
    hasInitializedSessions: () => initializedSession.size > 0,

    getSessionMessages: (sessionId: API.IdType) => messages.get(sessionId),
    isSessionInitialized: (sessionId: API.IdType) => initializedSession.has(sessionId),
  };

  const Decorator = {
    ...DecoratorPublic,
    _onChatMessage: (data: API.Message, sessionId: API.IdType) => {
      onMessageReceived(sessionId, data, 'chat_message');
    },

    _onStatusMessage: (data: API.Message, sessionId: API.IdType) => {
      onMessageReceived(sessionId, data, 'log_message');
    },

    _onSessionUpdated: (session: Partial<UI.MessageCounts>, sessionId: API.IdType) => {
      if (!session.message_counts) {
        return;
      }

      const sessionMessages = messages.get(sessionId);
      if (!sessionMessages) {
        return;
      }

      // Message limit exceed or messages were cleared?
      const splicedMessages = checkSplice(sessionMessages, session.message_counts.total);

      // Don't update the messages if nothing has changed
      // Session is updated when it's marked as read, which may happen simultaneously with the initial fetch.
      // Triggering an update would cause an incomplete message log being flashed to the user
      if (splicedMessages && splicedMessages !== sessionMessages) {
        messages.set(sessionId, splicedMessages);
        store.trigger(splicedMessages, sessionId);
      }
    },

    _onSessionRemoved: (session: ChatSession) => {
      if (store.scroll) {
        store.scroll._onSessionRemoved(session);
      }

      messages.delete(session.id);
      initializedSession.delete(session.id);
    },

    onSocketDisconnected: () => {
      if (store.scroll) {
        store.scroll.onSocketDisconnected();
      }

      messages.clear();
      initializedSession.clear();
    },

    hasMessages: () => messages.size > 0,
    hasInitializedSessions: () => initializedSession.size > 0,

    getSessionMessages: (sessionId: API.IdType) => messages.get(sessionId),
    isSessionInitialized: (sessionId: API.IdType) => initializedSession.has(sessionId),
  };

  store.listenTo(actions.fetchMessages, onFetchMessages);
  store.listenTo(
    (actions.fetchMessages as UI.AsyncActionType<ChatSession>).completed,
    onFetchMessagesCompleted,
  );

  return SocketSubscriptionDecorator(Object.assign(store, Decorator), access);
};

export default MessageStoreDecorator;
