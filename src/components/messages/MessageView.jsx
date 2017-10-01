'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Loader from 'components/semantic/Loader';
import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';
import ValueFormat from 'utils/ValueFormat';

import './messages.css';


const getMessageDay = (message) => {
  const time = message.chat_message ? message.chat_message.time : message.log_message.time;
  return new Date(time * 1000).getDate();
};

const isToday = (message) => {
  return getMessageDay(message) === new Date().getDate();
};

const isHistoryItem = (message) => {
  const time = message.chat_message ? message.chat_message.time : message.log_message.time;
  return time === 0; 
};

const showDivider = (index, messageList) => {
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


const getMessageListItem = (reduced, message, index, messageList) => {
  // Push a divider when the date was changed
  if (showDivider(index, messageList)) {
    const messageObj = message.chat_message ? message.chat_message : message.log_message;
    reduced.push(
      <div 
        key={ `divider${messageObj.id}` }
        className="ui horizontal date divider"
      >
        <i className="calendar icon"/>
        { ValueFormat.formatCalendarTime(messageObj.time) }
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
  } else {
    reduced.push(
      <StatusMessage
        key={ message.log_message.id }
        message={ message.log_message }
      />
    );
  }

  return reduced;
};

class MessageView extends React.Component {
  static propTypes = {
    messages: PropTypes.array,
    scrollableRef: PropTypes.func,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.messages !== this.props.messages;
  }

  render() {
    const { messages, className, scrollableRef } = this.props;
    return (
      <div 
        ref={ scrollableRef }
        className={ classNames('message-section', className) }
      >
        { messages ? (
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

export default ScrollDecorator(MessageView);