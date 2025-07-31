import { useSocket } from '@/context/SocketContext';
import {
  useSessionStoreApi,
  useSessionStoreProperty,
} from '@/context/SessionStoreContext';
import { useEffect } from 'react';

import * as UI from '@/types/ui';

export const useChatMessages = (
  chatSession: UI.SessionItemBase,
  messageStoreSelector: UI.MessageStoreSelector,
  chatAPI: UI.ChatAPIActions,
) => {
  const messages = useSessionStoreProperty((state) =>
    messageStoreSelector(state).messages.messages.get(chatSession.id),
  );

  const sessionStoreApi = useSessionStoreApi();
  const socket = useSocket();

  useEffect(() => {
    // Session changed, update the messages
    const messageStore = messageStoreSelector(sessionStoreApi.getState()).messages;
    if (!messageStore.isSessionInitialized(chatSession.id)) {
      chatAPI.fetchMessages(socket, chatSession, messageStore);
    }
  }, [chatSession.id]);

  return messages || null;
};
