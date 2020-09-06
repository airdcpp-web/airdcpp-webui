'use strict';
//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { TFunction } from 'i18next';

import Loader from 'components/semantic/Loader';

import { useMessageViewScrollEffect } from 'effects';
import { useMessagesNode } from './effects/MessageNodeManager';
import { useItemDownloadManager } from '../../effects/ItemDownloadManager';
import { translate } from 'utils/TranslationUtils';

import DownloadDialog from 'components/download/DownloadDialog';

import * as UI from 'types/ui';

import './messages.css';


interface MessageViewProps {
  messages: UI.MessageListItem[] | null;
  session?: UI.SessionItemBase;
  className?: string;
  scrollPositionHandler: UI.ScrollPositionHandler;
  t: TFunction;
}

const MessageView: React.FC<MessageViewProps> = React.memo(
  ({ messages, session, className, t, scrollPositionHandler }) => {
    const downloadManager = useItemDownloadManager(session);
    const { messageNodes, visibleItems } = useMessagesNode(messages, session, downloadManager);

    const scrollableRef = useMessageViewScrollEffect(
      messages,
      visibleItems,
      scrollPositionHandler,
      session
    );

    return (
      <div 
        ref={ scrollableRef }
        className={ classNames('message-section', className) }
      >
        { !!messageNodes ? (
          <>
            <div className="ui list message-list">
              { messageNodes }
            </div>
            <DownloadDialog
              { ...downloadManager.downloadDialogProps }
            />
          </>
        ) : (
          <Loader text={ translate('Loading messages', t, UI.Modules.COMMON) }/>
        ) }
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.messages === nextProps.messages;
  }
);

export default MessageView;