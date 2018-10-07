'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import Message from 'components/semantic/Message';
import MessageComposer from './MessageComposer';
import MessageView from 'components/messages/MessageView';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import LoginStore from 'stores/LoginStore';

import './chat.css';

import * as API from 'types/api';
import * as UI from 'types/ui';


export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatActions extends UI.ActionListType<UI.SessionItemBase> {
  clear: UI.ActionType<UI.SessionItemBase>;
  sendMessage: UI.ActionType<UI.SessionItemBase>;
  fetchMessages: UI.ActionType<UI.SessionItemBase>;
}

export interface ChatSessionProps {
  actions: ChatActions;
  session: ChatSession;
}

export interface ChatLayoutProps extends ChatSessionProps {
  chatAccess: string;
  messageStore: any;
}

interface State {
  messages: UI.MessageListItem[] | null;
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

  onMessagesChanged = (messages: UI.MessageListItem[], id: API.IdType) => {
    if (id !== this.props.session.id) {
      return;
    }

    this.setState({ messages: messages });
  }

  onSessionActivated = (session: ChatSession) => {
    const { messageStore, actions } = this.props;
    if (!messageStore.isSessionInitialized(session.id)) {
      this.setState({ 
        messages: null 
      });

      actions.fetchMessages(session);
    } else {
      this.setState({ 
        messages: messageStore.getSessionMessages(session.id) 
      });
    }
  }

  componentDidMount() {
    this.onSessionActivated(this.props.session);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  UNSAFE_componentWillReceiveProps(nextProps: ChatLayoutProps) {
    if (this.props.session.id !== nextProps.session.id) {
      this.onSessionActivated(nextProps.session);
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

export default ActiveSessionDecorator<ChatLayoutProps, ChatSession>(ChatLayout, true);
