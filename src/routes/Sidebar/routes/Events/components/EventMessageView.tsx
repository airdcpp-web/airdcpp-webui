import React from 'react';
//@ts-ignore
import Reflux from 'reflux';

import Loader from 'components/semantic/Loader';

import Message from 'components/semantic/Message';
import MessageView from 'components/messages/MessageView';

import '../style.css';


const mapViewMessage = (message: API.StatusMessage) => {
  return {
    log_message: message,
  };
};

interface EventMessagesProps {
  messages: API.StatusMessage[];
}

const EventMessageView: React.SFC<EventMessagesProps> = ({ messages }) => {
  if (!messages) {
    return <Loader text="Loading messages"/>;
  }

  if (messages.length === 0) {
    return (
      <Message 
        description="No messages to show"
      />
    );
  }

  return (
    <MessageView 
      className="events"
      messages={ messages.map(mapViewMessage) }
    />
  );
};

export default EventMessageView;
