import { useMemo } from 'react';
import * as React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { getListMessageId, getListMessageIdString } from 'utils/MessageUtils';

import { MessageListItem } from '../list/MessageListItem';
import { MessageListDateDivider, showDateDivider } from '../list/MessageListDateDivider';

import { ItemDownloadManager } from '../../../effects/ItemDownloadManager';

interface MessageItemData {
  entityId: API.IdType | undefined;
  onMessageVisibilityChanged: (id: number, inView: boolean) => void;
  addDownload: UI.AddItemDownload;
  highlightRemoteMenuId: string | undefined;
}

const reduceMessageListItem = (
  {
    entityId,
    onMessageVisibilityChanged,
    addDownload,
    highlightRemoteMenuId,
  }: MessageItemData,
  reduced: React.ReactNode[],
  message: UI.MessageListItem,
  index: number,
  messageList: UI.MessageListItem[],
) => {
  // Push a divider when the date was changed
  if (showDateDivider(index, messageList)) {
    const messageObj = !!message.chat_message
      ? message.chat_message
      : message.log_message;
    if (!!messageObj) {
      reduced.push(
        <MessageListDateDivider key={`divider${messageObj.id}`} time={messageObj.time} />,
      );
    }
  }

  // Push message
  const id = getListMessageId(message)!;
  reduced.push(
    <MessageListItem
      key={id}
      id={getListMessageIdString(id)}
      onChange={(inView) => {
        onMessageVisibilityChanged(id, inView);
      }}
      threshold={0.4}
      message={message}
      // Highlight menus must use table action menu because the text element has overflow: hidden
      // to allow long words to be cut (author action menu can still use the regular dropdown)
      highlightMenuProps={{
        addDownload,
        entityId,
        remoteMenuId: highlightRemoteMenuId,
        boundary: '.message-section',
        // Determining the position is somewhat complex since the number of remote menu items isn't known at this point
        // Only use the boundary for now, could be improved later...
        // position: index < 4 ? 'bottom left' : 'top left',
      }}
    />,
  );

  return reduced;
};

interface Props {
  messages: UI.MessageListItem[] | null;
  session?: UI.SessionItemBase;
  highlightRemoteMenuId?: string;
}

export const useMessagesNode = (
  { highlightRemoteMenuId, messages, session }: Props,
  downloadManager: ItemDownloadManager<UI.DownloadableItemInfo, Props>,
) => {
  const visibleItems = useMemo(() => new Set<number>(), [session]);

  const onMessageVisibilityChanged = (id: number, inView: boolean) => {
    if (!inView) {
      // console.log(`Remove view item ${id}`);
      visibleItems.delete(id);
    } else {
      // console.log(`Add view item ${id}`);
      visibleItems.add(id);
    }

    // console.log(`Visible items ${Array.from(visibleItems)}`);
  };

  const messageNodes = useMemo(() => {
    if (!messages) {
      return null;
    }

    return messages.reduce(
      reduceMessageListItem.bind(null, {
        highlightRemoteMenuId,
        entityId: session ? session.id : undefined,
        onMessageVisibilityChanged,
        addDownload: downloadManager.addDownloadItem,
      }),
      [],
    );
  }, [messages]);

  return {
    messageNodes,
    visibleItems,
  };
};
