import * as React from 'react';

import Message from 'components/semantic/Message';
import { MessageComposer } from './MessageComposer';
import MessageView from 'components/messages/MessageView';

import LoginStore from 'stores/LoginStore';

import './chat.css';

import * as UI from 'types/ui';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import { useTranslation } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';
import { useChatMessages } from './effects/useChatMessages';

export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatLayoutProps extends UI.ChatController {
  chatAccess: string;
  messageStore: UI.SessionMessageStore;
  highlightRemoteMenuId: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  session,
  chatAccess,
  chatApi,
  messageStore,
  highlightRemoteMenuId,
  ...other
}) => {
  const { t } = useTranslation();
  const messages = useChatMessages(session, messageStore, chatApi);
  const hasChatAccess = LoginStore.hasAccess(chatAccess);
  return (
    <div className="message-view">
      {!hasChatAccess && (
        <Message
          description={t<string>(
            toI18nKey('noChatAccess', UI.Modules.COMMON),
            `You aren't allowed to send new messages`
          )}
        />
      )}
      <MessageView
        className="chat"
        messages={messages}
        session={session}
        scrollPositionHandler={messageStore.scroll}
        t={t}
        highlightRemoteMenuId={highlightRemoteMenuId}
      />
      {hasChatAccess && (
        <MessageComposer session={session} chatApi={chatApi} t={t} {...other} />
      )}
    </div>
  );
};

export default ActiveSessionDecorator(ChatLayout, true);
