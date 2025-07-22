import { useSocket } from '@/context/SocketContext';
import { useSessionStore, useSessionStoreProperty } from '@/context/SessionStoreContext';
import { useEffect } from 'react';

import * as UI from '@/types/ui';

export const useChatMessages = (
  session: UI.SessionItemBase,
  messageStoreSelector: UI.MessageStoreSelector,
  chatAPI: UI.ChatAPIActions,
) => {
  const messages = useSessionStoreProperty((state) =>
    messageStoreSelector(state).messages.messages.get(session.id),
  );

  const store = useSessionStore();
  const socket = useSocket();

  useEffect(() => {
    // Session changed, update the messages
    const messageStore = messageStoreSelector(store).messages;
    if (!messageStore.isSessionInitialized(session.id)) {
      chatAPI.fetchMessages(socket, session, messageStore);
    }
  }, [session.id]);

  return messages || null;
};
