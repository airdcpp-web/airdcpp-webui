'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Loader from 'components/semantic/Loader';
import ScrollDecorator, { ScrollDecoratorChildProps } from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';
import { formatCalendarTime } from 'utils/ValueFormat';

import './messages.css';


const getMessageDay = (listItem: API.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && new Date(message.time * 1000).getDate();
};

const isToday = (message: API.MessageListItem) => {
  return getMessageDay(message) === new Date().getDate();
};

const isHistoryItem = (listItem: API.MessageListItem) => {
  const message = !!listItem.chat_message ? listItem.chat_message : listItem.log_message;
  return message && message.time === 0; 
};

const showDivider = (index: number, messageList: API.MessageListItem[]) => {
  const currentMessage = messageList[index];

  // First message? History log won't count
  if (index === 0 || (index === 1 && isHistoryItem(messageList[index-1]))) {
    // Don't show for message that were received today
    if (!isToday(currentMessage) && !isHistoryItem(currentMessage)) {
      return true;
    }

    return false;
  }

  return getMessageDay(messageList[index-1]) !== getMessageDay(currentMessage);
};


const getMessageListItem = (reduced: React.ReactNode[], message: API.MessageListItem, index: number, messageList: API.MessageListItem[]) => {
  // Push a divider when the date was changed
  if (showDivider(index, messageList)) {
    const messageObj = !!message.chat_message ? message.chat_message : message.log_message;
    !!messageObj && reduced.push(
      <div 
        key={ `divider${messageObj.id}` }
        className="ui horizontal date divider"
      >
        <i className="calendar icon"/>
        { formatCalendarTime(messageObj.time) }
      </div>
    );
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
  messages: API.MessageListItem[] | null;
  className?: string;
}

class MessageView extends React.Component<MessageViewProps & ScrollDecoratorChildProps> {
  /*static propTypes = {
    messages: PropTypes.array,
    scrollableRef: PropTypes.func,
  };*/

  shouldComponentUpdate(nextProps: MessageViewProps) {
    return nextProps.messages !== this.props.messages;
  }

  render() {
    const { messages, className, scrollableRef } = this.props;
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
          <Loader text="Loading messages"/>
        ) }
      </div>
    );
  }
}

export default ScrollDecorator<MessageViewProps>(MessageView);