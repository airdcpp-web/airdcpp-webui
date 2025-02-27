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
import { useSession } from '@/context/SessionContext';
import { useStoreProperty } from '@/context/StoreContext';

export interface ChatSession extends UI.SessionItemBase {
  hub_url?: string;
}

export interface ChatLayoutProps extends UI.ChatController {
  chatAccess: API.AccessEnum;
  storeSelector: UI.MessageStoreSelector;
  highlightRemoteMenuId: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  session,
  chatAccess,
  chatApi,
  storeSelector,
  highlightRemoteMenuId,
  chatCommands,
  ...other
}) => {
  const { hasAccess } = useSession();
  const { t } = useTranslation();
  const messages = useChatMessages(session, storeSelector, chatApi);
  const hasChatAccess = hasAccess(chatAccess);
  const scrollPositionHandler = useStoreProperty(
    (state) => storeSelector(state).messages.scroll,
  );

  useActiveSession(session, chatApi, storeSelector, true);

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
        session={session}
        scrollPositionHandler={scrollPositionHandler}
        t={t}
        highlightRemoteMenuId={highlightRemoteMenuId}
      />
      {hasChatAccess && (
        <MessageComposer
          session={session}
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
