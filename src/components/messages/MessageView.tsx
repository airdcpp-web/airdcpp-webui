'use strict';
//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Loader from 'components/semantic/Loader';
import { useMessageViewScrollEffect } from 'effects';
import { ChatMessage, StatusMessage } from './Message';
import { formatCalendarTime } from 'utils/ValueFormat';

import './messages.css';

import * as UI from 'types/ui';
import i18next from 'i18next';
import { translate } from 'utils/TranslationUtils';


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


const getMessageListItem = (
  reduced: React.ReactNode[], 
  message: UI.MessageListItem, 
  index: number, 
  messageList: UI.MessageListItem[]
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
          <i className="calendar icon"/>
          { formatCalendarTime(messageObj.time) }
        </div>
      );
    }
  }

  // Push the message
  if (message.chat_message) {
    reduced.push(
      <ChatMessage
        key={ message.chat_message.id }
        message={ message.chat_message }
        dropdownContext=".chat.session"
      />
    );
  } else if (message.log_message) {
    reduced.push(
      <StatusMessage
        key={ message.log_message.id }
        message={ message.log_message }
      />
    );
  }

  return reduced;
};


interface MessageViewProps {
  messages: UI.MessageListItem[] | null;
  session?: UI.SessionItemBase;
  className?: string;
  t: i18next.TFunction;
}

const MessageView: React.FC<MessageViewProps> = React.memo(
  ({ messages, session, className, t }) => {
    const scrollableRef = useMessageViewScrollEffect(messages, session);
    return (
      <div 
        ref={ scrollableRef }
        className={ classNames('message-section', className) }
      >
        { !!messages ? (
          <div className="ui list message-list">
            { messages.reduce(getMessageListItem, []) }
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