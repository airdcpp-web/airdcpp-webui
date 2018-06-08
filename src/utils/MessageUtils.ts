import update from 'immutability-helper';

// Remove the oldest messages to match the maximum cache count
const checkSplice = (messages: API.MessageListItem[], maxCacheMessageCount: number) => {
  if (messages) {
    const toRemove = messages.length - maxCacheMessageCount;
    if (toRemove > 0) {
      return update(messages, { $splice: [ [ 0, toRemove ] ] });
    }
  }

  return messages;
};

const filterListed = (messageList: API.MessageListItem[], message: API.MessageListItem) => {
  const id = getListMessageId(message);
  return !messageList.find(existingMessage => getListMessageId(existingMessage) === id);
};

const getListMessageId = (listItem: API.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message && message.id;
};

const getListMessageTime = (listItem: API.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message && message.time;
};

interface MessageSessionActions {
  setRead: (entityId: any) => void;
}

type SessionItem = (API.MessageSessionItem & { read?: undefined }) | (API.ReadableSessionItem & { message_counts?: undefined });

// Update the data with unread info that is marked as read
// Marks the session as read also in the backend
const checkUnread = (sessionItem: SessionItem, actions: MessageSessionActions, entityId: any): API.MessageSessionItem | API.ReadableSessionItem => {
  if (!sessionItem.message_counts) {
    // Non-chat session

    if (sessionItem.read === false) {
      actions.setRead(entityId);
      return {
        ...sessionItem,
        read: true,
      } as API.ReadableSessionItem;
    }
  } else if (!!sessionItem.message_counts) {
    // Chat session
    const counts = sessionItem.message_counts;

    // Any unread messages?
    if (!Object.keys(counts.unread).every(key => counts.unread[key] === 0)) {
      // Reset unread counts
      actions.setRead(entityId);

      // Don't flash unread counts in the UI
      const unreadCounts = Object.keys(counts.unread).reduce(
        (reduced, key) => {
          reduced[key] = 0;
          return reduced;
        }, {}
      );

      return {
        ...sessionItem,
        message_counts: {
          ...counts,
          unread: unreadCounts,
        }
      } as API.MessageSessionItem;
    }
  }

  // Nothing to update, return as it is
  return sessionItem;
};

// Messages may have been received via listener while fetching cached ones
// Append the received non-dupe messages to fetched list
const mergeCacheMessages = (cacheMessages: API.MessageListItem[], existingMessages = []) => {
  return [
    ...cacheMessages,
    ...existingMessages.filter(message => filterListed(cacheMessages, message)),
  ];
};

// Push the message to the existing list of messages (if it's not there yet)
// Returns the updated message list
const pushMessage = (message: API.MessageListItem, messages: API.MessageListItem[] = []) => {
  if (messages.length > 0) {
    // Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
    const lastMessage = messages[messages.length-1];
    const currentMessageId = getListMessageId(message);
    if (getListMessageId(lastMessage) >= currentMessageId) {
      return messages;
    }
  }

  return update(messages, { $push: [ message ] });
};

export {
  checkUnread,
  mergeCacheMessages,
  pushMessage,

  getListMessageId,
  getListMessageTime,
  checkSplice,
};
