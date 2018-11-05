'use strict';
//import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Message from 'components/semantic/Message';
import MessageComposer from './MessageComposer';
import MessageView from 'components/messages/MessageView';

import LoginStore from 'stores/LoginStore';

import './chat.css';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { useActiveSessionEffect } from 'effects';
import { SessionActions } from 'types/ui';


export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatActions extends UI.ActionListType<UI.SessionItemBase> {
  clear: UI.ActionType<UI.SessionItemBase>;
  sendMessage: UI.ActionType<UI.SessionItemBase>;
  fetchMessages: UI.ActionType<UI.SessionItemBase>;
}

export interface ChatSessionProps {
  actions: ChatActions & SessionActions<UI.SessionItemBase>;
  session: ChatSession;
}

export interface ChatLayoutProps extends ChatSessionProps {
  chatAccess: string;
  messageStore: any;
}


const useChatMessagesEffect = (session: ChatSession, messageStore: any, actions: ChatActions) => {
  const [ messages, setMessages ] = useState<UI.MessageListItem[] | null>([]);

  useEffect(
    () => {
      // Session changes, update the messages
      if (!messageStore.isSessionInitialized(session.id)) {
        setMessages(null);
        actions.fetchMessages(session);
      } else {
        setMessages(messageStore.getSessionMessages(session.id));
      }
    },
    [ session.id ]
  );


  useEffect(
    () => {
      // Subscribe for new messages
      const unsubscribe = messageStore.listen((newMessages: UI.MessageListItem[], id: API.IdType) => {
        if (id !== session.id) {
          return;
        }
    
        setMessages(newMessages);
      });

      return unsubscribe;
    },
    [ session.id ]
  );

  return messages;
};


const ChatLayout: React.SFC<ChatLayoutProps> = ({ session, chatAccess, actions, messageStore }) => {
  useActiveSessionEffect(session, actions, true);

  const messages = useChatMessagesEffect(session, messageStore, actions);
  const hasChatAccess = LoginStore.hasAccess(chatAccess);
  return (
    <div className="message-view">
      { !hasChatAccess && <Message description="You aren't allowed to send new messages"/> }
      <MessageView 
        className="chat"
        messages={ messages }
        session={ session }
      />
      { hasChatAccess && (
        <MessageComposer 
          session={ session }
          actions={ actions }
        />
      ) }
    </div>
  );
};

export default ChatLayout;
