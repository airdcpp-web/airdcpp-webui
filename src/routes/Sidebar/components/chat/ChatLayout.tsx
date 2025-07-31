import * as React from 'react';

import Message from '@/components/semantic/Message';
import { MessageComposer } from './MessageComposer';
import MessageView from '@/components/messages/MessageView';

import './chat.css';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useActiveSession } from '@/effects/ActiveSessionEffect';
import { useTranslation } from 'react-i18next';
import { toI18nKey } from '@/utils/TranslationUtils';
import { useChatMessages } from './effects/useChatMessages';
import { useSession } from '@/context/AppStoreContext';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { hasAccess } from '@/utils/AuthUtils';

export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatLayoutProps extends UI.ChatController {
  chatAccess: API.AccessEnum;
  storeSelector: UI.MessageStoreSelector;
  highlightRemoteMenuId: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  chatSession,
  chatAccess,
  chatApi,
  storeSelector,
  highlightRemoteMenuId,
  chatCommands,
  ...other
}) => {
  const session = useSession();
  const { t } = useTranslation();
  const messages = useChatMessages(chatSession, storeSelector, chatApi);
  const hasChatAccess = hasAccess(session, chatAccess);
  const scrollPositionHandler = useSessionStoreProperty(
    (state) => storeSelector(state).messages.scroll,
  );

  useActiveSession(chatSession, chatApi, storeSelector, true);

  return (
    <div className="message-view">
      {!hasChatAccess && (
        <Message
          description={t(
            toI18nKey('noChatAccess', UI.Modules.COMMON),
            `You aren't allowed to send new messages`,
          )}
        />
      )}
      <MessageView
        className="chat"
        messages={messages}
        chatSession={chatSession}
        scrollPositionHandler={scrollPositionHandler}
        t={t}
        highlightRemoteMenuId={highlightRemoteMenuId}
      />
      {hasChatAccess && (
        <MessageComposer
          chatSession={chatSession}
          chatApi={chatApi}
          chatCommands={chatCommands}
          t={t}
          {...other}
        />
      )}
    </div>
  );
};

export default ChatLayout;
