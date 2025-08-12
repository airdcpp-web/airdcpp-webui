import { useMemo } from 'react';
import * as React from 'react';

import * as UI from '@/types/ui';

import { getListMessageId, getListMessageIdString } from '@/utils/MessageUtils';

import { MessageListItem } from '../list/MessageListItem';
import { MessageListDateDivider, showDateDivider } from '../list/MessageListDateDivider';

import { ItemDownloadManager } from '../../../effects/ItemDownloadManager';
import { debounce } from 'lodash';

interface MessageItemData {
  entity: UI.SessionItemBase | undefined;
  onMessageVisibilityChanged: (id: number, inView: boolean) => void;
  addDownload: UI.AddItemDownload;
  highlightRemoteMenuId: string | undefined;
  scrollable: HTMLDivElement | null;
}

const reduceMessageListItem = (
  {
    entity,
    onMessageVisibilityChanged,
    addDownload,
    highlightRemoteMenuId,
    scrollable,
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
      root={scrollable}
      message={message}
      // Highlight menus must use table action menu because the text element has overflow: hidden
      // to allow long words to be cut (author action menu can still use the regular dropdown)
      highlightMenuProps={{
        addDownload,
        entity,
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
  chatSession: UI.SessionItemBase | undefined;
  highlightRemoteMenuId: string | undefined;
}

export const useMessagesNode = (
  { highlightRemoteMenuId, messages, chatSession }: Props,
  downloadManager: ItemDownloadManager<UI.DownloadableItemInfo, Props>,
  scrollable: HTMLDivElement | null,
) => {
  const visibleItemSet = React.useRef<Set<number>>(new Set());
  const [visibleItems, setVisibleItems] = React.useState<number[]>([]);

  const debouncedUpdateVisibleItems = React.useMemo(
    () =>
      debounce(() => {
        // console.log(`Visible items ${Array.from(visibleItemSet.current)}`);
        setVisibleItems(Array.from(visibleItemSet.current));
      }, 20),
    [],
  );

  const onMessageVisibilityChanged = (id: number, inView: boolean) => {
    if (!inView) {
      // console.log(`Remove view item ${id}`);
      visibleItemSet.current.delete(id);
    } else {
      //console.log(`Add view item ${id}`);
      visibleItemSet.current.add(id);
    }

    debouncedUpdateVisibleItems();
  };

  const messageNodes = useMemo(() => {
    if (!messages) {
      return null;
    }

    return messages.reduce(
      reduceMessageListItem.bind(null, {
        highlightRemoteMenuId,
        entity: chatSession,
        onMessageVisibilityChanged,
        addDownload: downloadManager.addDownloadItem,
        scrollable,
      }),
      [],
    );
  }, [messages]);

  return {
    messageNodes,
    visibleItems,
  };
};
