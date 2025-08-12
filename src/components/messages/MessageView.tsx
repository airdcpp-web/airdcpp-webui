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
    const scrollableRef = React.useRef<HTMLDivElement | null>(null);
    const downloadManager = useItemDownloadManager(chatSession);
    const { messageNodes, visibleItems } = useMessagesNode(
      {
        highlightRemoteMenuId,
        messages,
        chatSession,
      },
      downloadManager,
      scrollableRef.current,
    );

    useMessageViewScrollEffect(
      { messages, scrollPositionHandler, chatSession },
      visibleItems,
      scrollableRef.current,
    );

    return (
      <div
        ref={scrollableRef}
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
