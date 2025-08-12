import { produce } from 'immer';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { checkSplice, mergeCacheMessages, pushMessage } from '@/utils/MessageUtils';
import { lens } from '@dhmk/zustand-lens';
import { createSessionScrollSlice, initSessionScrollSlice } from './scrollSlice';

export const createMessageSlice = () => {
  type State = UI.MessageSlice;

  const createSlice = lens<State, UI.SessionStore>((set, get) => {
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

      /*onFetchMessages: (chatSession: UI.SessionItemBase) =>
        set(
          produce<State>((state) => {
            state.initializedSession.add(chatSession.id);
          }),
        ),*/

      onMessagesFetched: (chatSession: UI.SessionItemBase, cacheMessages: MessageCache) =>
        set(
          produce<State>((state) => {
            const mergedMessages = mergeCacheMessages(
              cacheMessages,
              get().messages.get(chatSession.id),
            );
            state.messages.set(chatSession.id, mergedMessages);
            state.initializedSession.add(chatSession.id);
          }),
        ),

      addChatMessage: (data: API.Message, sessionId: API.IdType) => {
        onMessageReceived(sessionId, data, 'chat_message');
      },

      addStatusMessage: (data: API.Message, sessionId: API.IdType) => {
        onMessageReceived(sessionId, data, 'log_message');
      },

      updateSession: (chatSession: Partial<UI.MessageCounts>, sessionId: API.IdType) =>
        set(
          produce<State>((state) => {
            if (!chatSession.message_counts) {
              return;
            }

            const sessionMessages = state.messages.get(sessionId);
            if (!sessionMessages) {
              return;
            }

            // Message limit exceed or messages were cleared?
            const splicedMessages = checkSplice(
              sessionMessages,
              chatSession.message_counts.total,
            );

            // Don't update the messages if nothing has changed
            // Session is updated when it's marked as read, which may happen simultaneously with the initial fetch.
            // Triggering an update would cause an incomplete message log being flashed to the user
            if (splicedMessages && splicedMessages !== sessionMessages) {
              state.messages.set(sessionId, splicedMessages);
            }
          }),
        ),

      removeSession: (chatSession: ChatSession) => {
        set(
          produce<State>((state) => {
            state.messages.delete(chatSession.id);
            state.initializedSession.delete(chatSession.id);
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

export const initMessageSlice = async (
  messageSlice: UI.MessageSlice,
  initData: UI.SessionInitData,
) => {
  await initSessionScrollSlice(messageSlice.scroll, initData);

  const { addSocketListener } = initData;
  await addSocketListener('message', messageSlice.addChatMessage);
  await addSocketListener('status', messageSlice.addStatusMessage);

  await addSocketListener('removed', messageSlice.removeSession);
  await addSocketListener('updated', messageSlice.updateSession);
};
