import { produce } from 'immer';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { checkSplice, mergeCacheMessages, pushMessage } from 'utils/MessageUtils';
import { lens } from '@dhmk/zustand-lens';
import { createSessionScrollSlice, initSessionScrollSlice } from './scrollSlice';

export const createMessageSlice = () => {
  type State = UI.MessageSlice;

  const createSlice = lens<State, UI.Store>((set, get) => {
    type MessageCache = UI.MessageListItem[];
    type ChatSession = UI.SessionItemBase;

    const onMessageReceived = (
      sessionId: API.IdType,
      message: API.Message,
      type: UI.MessageType,
    ) => {
      set(
        produce<State>((state) => {
          state.messages.set(
            sessionId,
            pushMessage(
              {
                [type]: message,
              } as UI.MessageListItem,
              state.messages.get(sessionId),
            ),
          );
        }),
      );
    };

    const slice = {
      // Message arrays mapped by session IDs
      messages: new Map<API.IdType, UI.MessageListItem[]>(),

      // Keep track of session IDs for which message fetching has been initialized
      initializedSession: new Set<API.IdType>(),

      scroll: createSessionScrollSlice(),

      onFetchMessages: (session: UI.SessionItemBase) =>
        set(
          produce<State>((state) => {
            state.initializedSession.add(session.id);
          }),
        ),

      onMessagesFetched: (session: UI.SessionItemBase, cacheMessages: MessageCache) =>
        set(
          produce<State>((state) => {
            state.messages.set(
              session.id,
              mergeCacheMessages(cacheMessages, get().messages.get(session.id)),
            );
          }),
        ),

      addChatMessage: (data: API.Message, sessionId: API.IdType) => {
        onMessageReceived(sessionId, data, 'chat_message');
      },

      addStatusMessage: (data: API.Message, sessionId: API.IdType) => {
        onMessageReceived(sessionId, data, 'log_message');
      },

      updateSession: (session: Partial<UI.MessageCounts>, sessionId: API.IdType) =>
        set(
          produce<State>((state) => {
            if (!session.message_counts) {
              return;
            }

            const sessionMessages = state.messages.get(sessionId);
            if (!sessionMessages) {
              return;
            }

            // Message limit exceed or messages were cleared?
            const splicedMessages = checkSplice(
              sessionMessages,
              session.message_counts.total,
            );

            // Don't update the messages if nothing has changed
            // Session is updated when it's marked as read, which may happen simultaneously with the initial fetch.
            // Triggering an update would cause an incomplete message log being flashed to the user
            if (splicedMessages && splicedMessages !== sessionMessages) {
              state.messages.set(sessionId, splicedMessages);
            }
          }),
        ),

      removeSession: (session: ChatSession) => {
        set(
          produce<State>((state) => {
            state.messages.delete(session.id);
            state.initializedSession.delete(session.id);
          }),
        );
      },

      hasMessages: () => get().messages.size > 0,
      hasInitializedSessions: () => get().initializedSession.size > 0,

      isSessionInitialized: (sessionId: API.IdType) =>
        get().initializedSession.has(sessionId),
    };

    return slice;
  });

  return createSlice;
};

export const initMessageSlice = (
  messageSlice: UI.MessageSlice,
  initData: UI.SessionInitData,
) => {
  initSessionScrollSlice(messageSlice.scroll, initData);

  const { addSocketListener } = initData;
  addSocketListener('message', messageSlice.addChatMessage);
  addSocketListener('status', messageSlice.addStatusMessage);

  addSocketListener('removed', messageSlice.removeSession);
  addSocketListener('updated', messageSlice.updateSession);
};
