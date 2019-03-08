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
//import { useActiveSessionEffect } from 'effects';
//import { SessionActions } from 'types/ui';
import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import { useTranslation } from 'react-i18next';
import { AddTempShareResponse } from 'services/api/ShareApi';
import { toI18nKey } from 'utils/TranslationUtils';


export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatAPI extends UI.RefluxActionListType<UI.SessionItemBase> {
  //clear: UI.RefluxActionType<UI.SessionItemBase>;
  sendMessage: UI.RefluxActionType<UI.SessionItemBase>;
  fetchMessages: UI.RefluxActionType<UI.SessionItemBase>;
}

export interface ChatActions extends UI.ActionListType<UI.SessionItemBase> {
  clear: UI.ActionType<UI.SessionItemBase>;
  //sendMessage: UI.RefluxActionType<UI.SessionItemBase>;
  //fetchMessages: UI.RefluxActionType<UI.SessionItemBase>;
}

export interface ChatLayoutProps {
  //actions: UI.ModuleActions<UI.SessionItemBase> & {
  //  actions: ChatActions & SessionActions<UI.SessionItemBase>;
  //};
  //chatApi: ChatActions & SessionActions<UI.SessionItemBase>;
  chatApi: ChatAPI;
  chatActions: ChatActions;
  handleFileUpload: (file: File) => Promise<AddTempShareResponse>;
  session: ChatSession;
  chatAccess: string;
  messageStore: any;
}

//export interface ChatLayoutProps extends ChatSessionProps {

//}


const useChatMessagesEffect = (session: ChatSession, messageStore: any, chatAPI: ChatAPI) => {
  const [ messages, setMessages ] = useState<UI.MessageListItem[] | null>([]);

  useEffect(
    () => {
      // Session changes, update the messages
      if (!messageStore.isSessionInitialized(session.id)) {
        setMessages(null);
        chatAPI.fetchMessages(session);
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


const ChatLayout: React.FC<ChatLayoutProps> = (
  { session, chatAccess, chatApi, chatActions, messageStore, handleFileUpload }
) => {
  //useActiveSessionEffect(session, actions, true);
  const { t } = useTranslation();
  const messages = useChatMessagesEffect(session, messageStore, chatApi);
  const hasChatAccess = LoginStore.hasAccess(chatAccess);
  return (
    <div className="message-view">
      { !hasChatAccess && (
        <Message 
          description={ t<string>(
            toI18nKey('noChatAccess', UI.Modules.COMMON), 
            `You aren't allowed to send new messages`
          ) }
        />
      ) }
      <MessageView 
        className="chat"
        messages={ messages }
        session={ session }
        t={ t }
      />
      { hasChatAccess && (
        <MessageComposer 
          session={ session }
          chatApi={ chatApi }
          chatActions={ chatActions }
          t={ t }
          handleFileUpload={ handleFileUpload }
          //chatAccess={ chatAccess }
        />
      ) }
    </div>
  );
};

export default ActiveSessionDecorator(ChatLayout, true);
