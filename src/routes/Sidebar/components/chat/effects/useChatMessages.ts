import { useSocket } from '@/context/SocketContext';
import { useAppStore, useStoreProperty } from '@/context/StoreContext';
import { useEffect } from 'react';

// import * as API from '@/types/api';
import * as UI from '@/types/ui';

/*export type MessageStoreSelector = (
  state: UI.Store,
) => UI.MessageSlice & UI.SessionSlice<UI.SessionType>;*/

export const useChatMessages = (
  session: UI.SessionItemBase,
  messageStoreSelector: UI.MessageStoreSelector,
  chatAPI: UI.ChatAPIActions,
) => {
  // const [messages, setMessages] = useState<UI.MessageListItem[] | null>([]);
  //const messages = useStoreProperty((state) => state.hubs.messages.get(session.id));
  const messages = useStoreProperty((state) =>
    messageStoreSelector(state).messages.messages.get(session.id),
  );
  /*const isSessionInitialized = useStoreProperty(
    (state) => messageStoreSelector(state).messages.isSessionInitialized,
  );
  const onMessagesFetched = useStoreProperty(
    (state) => messageStoreSelector(state).messages.onMessagesFetched,
  );*/

  const store = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    // Session changed, update the messages
    const messageStore = messageStoreSelector(store).messages;
    if (!messageStore.isSessionInitialized(session.id)) {
      // setMessages(null);
      chatAPI.fetchMessages(socket, session, messageStore);
    } /*else {
      const sessionMessages = messageStore.getMessages(session.id);
      if (sessionMessages) {
        setMessages(sessionMessages);
      }
    }*/
  }, [session.id]);

  /*useEffect(() => {
    // Subscribe for new messages
    const unsubscribe = (messageStore as any).listen(
      (newMessages: UI.MessageListItem[], id: API.IdType) => {
        if (id !== session.id) {
          return;
        }

        setMessages(newMessages);
      },
    );

    return unsubscribe;
  }, [session.id]);*/

  return messages || null;
};
