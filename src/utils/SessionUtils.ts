// import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { checkUnreadMessageCacheInfo } from './MessageUtils';

// Update the data with unread info that is marked as read
// Marks the session as read also in the backend
export const checkUnreadSessionInfo = <UnreadItemT extends UI.UnreadInfo>(
  unreadInfoItem: UnreadItemT,
  setRead: () => void,
): UnreadItemT => {
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
    const newCacheInfo = checkUnreadMessageCacheInfo(
      unreadInfoItem.message_counts,
      setRead,
    );
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
