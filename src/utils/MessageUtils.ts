import update from 'immutability-helper';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

// Remove the oldest messages to match the maximum cache count
const checkSplice = (
  messages: UI.MessageListItem[] | undefined,
  maxCacheMessageCount: number,
) => {
  if (messages) {
    const toRemove = messages.length - maxCacheMessageCount;
    if (toRemove > 0) {
      return update(messages, { $splice: [[0, toRemove]] });
    }
  }

  return messages;
};

const filterListed = (messageList: UI.MessageListItem[], message: UI.MessageListItem) => {
  const id = getListMessageId(message);
  return !messageList.find((existingMessage) => getListMessageId(existingMessage) === id);
};

const getListMessageId = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message ? message.id : undefined;
};

const getListMessageIdString = (id: number) => {
  return `message-list-item-${id}`;
};

const getListMessageTime = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return !!message ? message.time : undefined;
};

type MessageCounts = API.ChatMessageCounts | API.StatusMessageCounts;
type UnreadMessageCounts = API.UnreadChatMessageCounts | API.UnreadStatusMessageCounts;
type KeysOfUnion<T> = T extends T ? keyof T : never;

const checkUnreadCacheInfo = (
  counts: MessageCounts,
  setRead: () => void,
): MessageCounts => {
  // Any unread messages?
  if (!Object.values(counts.unread).every((value) => value === 0)) {
    // Reset unread counts
    setRead();

    // Don't flash unread counts in the UI
    const unreadCounts = Object.keys(counts.unread).reduce(
      (reduced, messageType) => {
        reduced[messageType as KeysOfUnion<UnreadMessageCounts>] = 0;
        return reduced;
      },
      {} as Record<KeysOfUnion<UnreadMessageCounts>, number>,
    );

    return {
      ...counts,
      unread: {
        ...unreadCounts,
      },
    } as MessageCounts;
  }

  return counts;
};

// Update the data with unread info that is marked as read
// Marks the session as read also in the backend
const checkUnreadSessionInfo = <SessionT extends UI.UnreadInfo>(
  unreadInfoItem: SessionT,
  setRead: () => void,
): SessionT => {
  if (!unreadInfoItem.message_counts && unreadInfoItem.hasOwnProperty('read')) {
    // Non-message item

    if (unreadInfoItem.read === false) {
      setRead();
      return {
        ...unreadInfoItem,
        read: true,
      };
    }
  } else if (!!unreadInfoItem.message_counts) {
    // Message cache
    const newCacheInfo = checkUnreadCacheInfo(unreadInfoItem.message_counts, setRead);
    return {
      ...unreadInfoItem,
      message_counts: newCacheInfo,
    };
  } else {
    console.error('Invalid object supplied to checkUnread', unreadInfoItem);
  }

  // Nothing to update, return as it is
  return unreadInfoItem;
};

const listMessageSort = (a: UI.MessageListItem, b: UI.MessageListItem) => {
  return getListMessageTime(a)! - getListMessageTime(b)!;
};

// Messages may have been received via listener while fetching cached ones
// Append the received non-dupe messages to fetched list
const mergeCacheMessages = (
  cacheMessages: UI.MessageListItem[],
  existingMessages: UI.MessageListItem[] | undefined = [],
): UI.MessageListItem[] => {
  return [
    ...existingMessages.filter((message) => filterListed(cacheMessages, message)),
    ...cacheMessages,
  ].sort(listMessageSort);
};

// Push the message to the existing list of messages (if it's not there yet)
// Returns the updated message list
const pushMessage = (
  message: UI.MessageListItem,
  messages: UI.MessageListItem[] = [],
) => {
  if (messages.length > 0) {
    // Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
    const lastMessage = messages[messages.length - 1];
    const currentMessageId = getListMessageId(message);
    if (getListMessageId(lastMessage)! >= currentMessageId!) {
      return messages;
    }
  }

  return [...messages, message];
};

export {
  checkUnreadCacheInfo,
  checkUnreadSessionInfo,
  mergeCacheMessages,
  pushMessage,
  getListMessageId,
  getListMessageTime,
  listMessageSort,
  checkSplice,
  getListMessageIdString,
};
