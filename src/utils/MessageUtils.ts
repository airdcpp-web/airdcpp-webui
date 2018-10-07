import update from 'immutability-helper';

import * as API from 'types/api';
import * as UI from 'types/ui';


// Remove the oldest messages to match the maximum cache count
const checkSplice = (messages: UI.MessageListItem[], maxCacheMessageCount: number) => {
  if (messages) {
    const toRemove = messages.length - maxCacheMessageCount;
    if (toRemove > 0) {
      return update(messages, { $splice: [ [ 0, toRemove ] ] });
    }
  }

  return messages;
};

const filterListed = (messageList: UI.MessageListItem[], message: UI.MessageListItem) => {
  const id = getListMessageId(message);
  return !messageList.find(existingMessage => getListMessageId(existingMessage) === id);
};

const getListMessageId = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message && message.id;
};

const getListMessageTime = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message && message.time;
};

interface MessageSessionActions {
  setRead: (session: UI.SessionItemBase) => void;
}

// Update the data with unread info that is marked as read
// Marks the session as read also in the backend
const checkUnread = (
  session: UI.SessionUpdateProperties, 
  actions: MessageSessionActions,
  sessionId: API.IdType
): UI.SessionUpdateProperties => {
  if (!session.message_counts) {
    // Non-chat session

    if (session.read === false) {
      actions.setRead({ id: sessionId });
      return {
        ...session,
        read: true,
      };
    }
  } else if (!!session.message_counts) {
    // Chat session
    const counts = session.message_counts;

    // Any unread messages?
    if (!Object.keys(counts.unread).every(key => counts.unread[key] === 0)) {
      // Reset unread counts
      actions.setRead({ id: sessionId });

      // Don't flash unread counts in the UI
      const unreadCounts = Object.keys(counts.unread).reduce(
        (reduced, messageType) => {
          reduced[messageType] = 0;
          return reduced;
        }, 
        {} as API.UnreadChatMessageCounts | API.UnreadStatusMessageCounts
      );

      return {
        ...session,
        message_counts: {
          ...counts,
          unread: unreadCounts,
        }
      } as UI.SessionUpdateProperties;
    }
  }

  // Nothing to update, return as it is
  return session;
};

// Messages may have been received via listener while fetching cached ones
// Append the received non-dupe messages to fetched list
const mergeCacheMessages = (cacheMessages: UI.MessageListItem[], existingMessages = []) => {
  return [
    ...cacheMessages,
    ...existingMessages.filter(message => filterListed(cacheMessages, message)),
  ];
};

// Push the message to the existing list of messages (if it's not there yet)
// Returns the updated message list
const pushMessage = (message: UI.MessageListItem, messages: UI.MessageListItem[] = []) => {
  if (messages.length > 0) {
    // Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
    const lastMessage = messages[messages.length - 1];
    const currentMessageId = getListMessageId(message);
    if (getListMessageId(lastMessage) >= currentMessageId) {
      return messages;
    }
  }

  return [ ...messages, message ];
};

export {
  checkUnread,
  mergeCacheMessages,
  pushMessage,

  getListMessageId,
  getListMessageTime,
  checkSplice,
};
