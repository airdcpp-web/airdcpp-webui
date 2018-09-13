'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import MessageComposer from './MessageComposer';
import MessageView from 'components/messages/MessageView';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import LoginStore from 'stores/LoginStore';

import './chat.css';


export interface ChatSessionProps {
  actions: {
    clear: UI.ActionType;
    sendMessage: UI.ActionType;
    fetchMessages: UI.ActionType;
  };
  session: {
    id: API.IdType;
    hub_url: string;
  };
};

export interface ChatLayoutProps extends ChatSessionProps {
  chatAccess: string;
  messageStore: any;
}

interface State {
  messages: API.MessageListItem[] | null;
}

class ChatLayout extends React.Component<ChatLayoutProps, State> {
  /*static propTypes = {
		// Access required for sending messages
    chatAccess: PropTypes.string.isRequired,

    session: PropTypes.any.isRequired,

    messageStore: PropTypes.object.isRequired,

    actions: PropTypes.object.isRequired,
  };*/

  unsubscribe: () => void;

  state = {
    messages: null,
  };

  constructor(props: ChatLayoutProps) {
    super(props);
    this.unsubscribe = props.messageStore.listen(this.onMessagesChanged);
  }

  onMessagesChanged = (messages: API.MessageListItem[], id: API.IdType) => {
    if (id !== this.props.session.id) {
      return;
    }

    this.setState({ messages: messages });
  };

  onSessionActivated = (id: API.IdType) => {
    const { messageStore, actions } = this.props;
		
    if (!messageStore.isSessionInitialized(id)) {
      this.setState({ 
        messages: null 
      });

      actions.fetchMessages(id);
    } else {
      this.setState({ 
        messages: messageStore.getSessionMessages(id) 
      });
    }
  };

  componentDidMount() {
    this.onSessionActivated(this.props.session.id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  UNSAFE_componentWillReceiveProps(nextProps: ChatLayoutProps) {
    if (this.props.session.id != nextProps.session.id) {
      this.onSessionActivated(nextProps.session.id);
    }
  }

  render() {
    const hasChatAccess = LoginStore.hasAccess(this.props.chatAccess);
    return (
      <div className="message-view">
        { !hasChatAccess && <Message description="You aren't allowed to send new messages"/> }
        <MessageView 
          className="chat"
          messages={ this.state.messages }
          session={ this.props.session }
        />
        { hasChatAccess && (
          <MessageComposer 
            session={ this.props.session }
            actions={ this.props.actions }
          />
        ) }
      </div>
    );
  }
}

export default ActiveSessionDecorator(ChatLayout, true);
