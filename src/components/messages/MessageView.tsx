import * as React from 'react';
import classNames from 'classnames';

import Loader from '@/components/semantic/Loader';

import { useMessageViewScrollEffect } from '@/effects';
import { useMessagesNode } from './effects/MessageNodeManager';
import { useItemDownloadManager } from '../../effects/ItemDownloadManager';
import { translate } from '@/utils/TranslationUtils';

import DownloadDialog from '@/components/download/DownloadDialog';

import * as UI from '@/types/ui';

import './messages.css';

interface MessageViewProps {
  messages: UI.MessageListItem[] | null;
  chatSession?: UI.SessionItemBase;
  className?: string;
  scrollPositionHandler: UI.ScrollHandler;
  highlightRemoteMenuId?: string;
  t: UI.TranslateF;
}

const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({
    className,
    t,
    messages,
    chatSession,
    highlightRemoteMenuId,
    scrollPositionHandler,
  }) {
    // Can't use ref because we need to re-run the scroll hooks when the element is available
    const [scrollable, setScrollable] = React.useState<HTMLDivElement | null>(null);
    const downloadManager = useItemDownloadManager(chatSession);
    const { messageNodes, visibleItems } = useMessagesNode(
      {
        highlightRemoteMenuId,
        messages,
        chatSession,
      },
      downloadManager,
      scrollable,
    );

    useMessageViewScrollEffect(
      { messages, scrollPositionHandler, chatSession },
      visibleItems,
      scrollable,
    );

    return (
      <div
        ref={setScrollable}
        className={classNames('message-section', className)}
        role="article"
      >
        {!!messageNodes ? (
          <>
            <div className="ui list message-list">{messageNodes}</div>
            <DownloadDialog {...downloadManager.downloadDialogProps} />
          </>
        ) : (
          <Loader text={translate('Loading messages', t, UI.Modules.COMMON)} />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.messages === nextProps.messages;
  },
);

export default MessageView;
