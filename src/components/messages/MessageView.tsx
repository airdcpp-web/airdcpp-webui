'use strict';
//import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { TFunction } from 'i18next';

import Loader from 'components/semantic/Loader';
import { useMessageViewScrollEffect } from 'effects';
import { ChatMessage, StatusMessage } from './Message';
import { formatCalendarTime } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
import { getListMessageId, getListMessageIdString } from 'utils/MessageUtils';

import './messages.css';


const getMessageDay = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && new Date(message.time * 1000).getDate();
};

const isToday = (message: UI.MessageListItem) => {
  return getMessageDay(message) === new Date().getDate();
};

const isHistoryItem = (listItem: UI.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && message.time === 0; 
};

const showDivider = (index: number, messageList: UI.MessageListItem[]) => {
  const currentMessage = messageList[index];

  // First message? History log won't count
  if (index === 0 || (index === 1 && isHistoryItem(messageList[index - 1]))) {
    // Don't show for message that were received today
    if (!isToday(currentMessage) && !isHistoryItem(currentMessage)) {
      return true;
    }

    return false;
  }

  return getMessageDay(messageList[index - 1]) !== getMessageDay(currentMessage);
};

const toListMessage = (message: UI.MessageListItem, entityId: API.IdType | undefined) => {
  if (message.chat_message) {
    return (
      <ChatMessage
        message={ message.chat_message }
        dropdownContext=".chat.session"
        entityId={ entityId! }
      />
    );
  } else if (message.log_message) {
    return (
      <StatusMessage
        message={ message.log_message }
      />
    );
  }

  return null;
};

const reduceMessageListItem = (
  t: TFunction,
  entityId: API.IdType | undefined,
  onMessageVisibilityChanged: (id: number, inView: boolean) => void,
  reduced: React.ReactNode[], 
  message: UI.MessageListItem, 
  index: number, 
  messageList: UI.MessageListItem[],
) => {
  // Push a divider when the date was changed
  if (showDivider(index, messageList)) {
    const messageObj = !!message.chat_message ? message.chat_message : message.log_message;
    if (!!messageObj) {
      reduced.push(
        <div 
          key={ `divider${messageObj.id}` }
          className="ui horizontal date divider"
        >
          <Icon 
            icon={ IconConstants.DATE }
          />
          { formatCalendarTime(messageObj.time, t) }
        </div>
      );
    }
  }

  const id = getListMessageId(message)!;
  reduced.push(
    <InView 
      key={ id }
      id={ getListMessageIdString(id) }
      onChange={(inView) => {
        onMessageVisibilityChanged(id, inView);
      }}
      threshold={0.4}
    >
      { toListMessage(message, entityId) }
    </InView>
  );

  return reduced;
};

interface MessageViewProps {
  messages: UI.MessageListItem[] | null;
  session?: UI.SessionItemBase;
  className?: string;
  scrollPositionHandler: UI.ScrollPositionHandler;
  t: TFunction;
}

const MessageView: React.FC<MessageViewProps> = React.memo(
  ({ messages, session, className, t, scrollPositionHandler }) => {
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
        { !!messages ? (
          <div className="ui list message-list">
            { messages.reduce(
                reduceMessageListItem.bind(null, t, session ? session.id : undefined, onMessageVisibilityChanged), 
                []
              ) 
            }
          </div>
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