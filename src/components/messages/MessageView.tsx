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
  session?: UI.SessionItemBase;
  className?: string;
  scrollPositionHandler: UI.ScrollHandler;
  highlightRemoteMenuId?: string;
  t: UI.TranslateF;
}

const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ className, t, ...other }) {
    const downloadManager = useItemDownloadManager(other.session);
    const { messageNodes, visibleItems } = useMessagesNode(other, downloadManager);

    const scrollableRef = useMessageViewScrollEffect(other, visibleItems);

    return (
      <div ref={scrollableRef} className={classNames('message-section', className)}>
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
