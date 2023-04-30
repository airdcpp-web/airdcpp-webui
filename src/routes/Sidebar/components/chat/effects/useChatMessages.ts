import { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

/*export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatLayoutProps extends UI.ChatController {
  chatAccess: string;
  messageStore: UI.SessionMessageStore;
  highlightRemoteMenuId: string;
}*/

export const useChatMessages = (
  session: UI.SessionItemBase,
  messageStore: UI.SessionMessageStore,
  chatAPI: UI.ChatAPI
) => {
  const [messages, setMessages] = useState<UI.MessageListItem[] | null>([]);

  useEffect(() => {
    // Session changed, update the messages
    if (!messageStore.isSessionInitialized(session.id)) {
      setMessages(null);
      chatAPI.fetchMessages(session);
    } else {
      const sessionMessages = messageStore.getSessionMessages(session.id);
      if (sessionMessages) {
        setMessages(sessionMessages);
      }
    }
  }, [session.id]);

  useEffect(() => {
    // Subscribe for new messages
    const unsubscribe = (messageStore as any).listen(
      (newMessages: UI.MessageListItem[], id: API.IdType) => {
        if (id !== session.id) {
          return;
        }

        setMessages(newMessages);
      }
    );

    return unsubscribe;
  }, [session.id]);

  return messages;
};
