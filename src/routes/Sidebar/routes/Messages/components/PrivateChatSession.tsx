import ChatLayout from '@/routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from '@/routes/Sidebar/routes/Messages/components/MessageFooter';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { shareTempFile } from '@/services/api/ShareApi';
import MenuConstants from '@/constants/MenuConstants';
import { SessionChildProps } from '@/routes/Sidebar/components/types';
import { useSession } from '@/context/AppStoreContext';
import { buildChatCommands } from '@/routes/Sidebar/components/chat/commands/ChatCommands';
import { clearPrivateChatMessages } from '@/services/api/PrivateChatApi';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { PrivateChatStoreSelector } from '@/stores/session/privateChatSessionSlice';
import { useSocket } from '@/context/SocketContext';

type PrivateChatSessionProps = SessionChildProps<
  API.PrivateChat,
  UI.EmptyObject
  // UI.ChatActionList
>;

const PrivateChatCommands = buildChatCommands(
  API.AccessEnum.PRIVATE_CHAT_EDIT,
  clearPrivateChatMessages,
);

const PrivateChatSession: React.FC<PrivateChatSessionProps> = ({
  sessionItem,
  sessionT,
}) => {
  const login = useSession();
  const socket = useSocket();
  const handleFileUpload = (file: File) => {
    const { cid, hub_url: hubUrl, flags } = sessionItem.user;

    const isPrivate = !flags.includes('nmdc') && !flags.includes('bot');
    return shareTempFile(
      { file, hubUrl, cid: isPrivate ? cid : undefined },
      login,
      socket,
    );
  };

  return (
    <div className="private chat session">
      <ChatLayout
        chatAccess={API.AccessEnum.PRIVATE_CHAT_SEND}
        chatApi={PrivateChatAPIActions}
        chatCommands={PrivateChatCommands}
        storeSelector={PrivateChatStoreSelector}
        chatSession={sessionItem}
        handleFileUpload={handleFileUpload}
        highlightRemoteMenuId={MenuConstants.PRIVATE_CHAT_MESSAGE_HIGHLIGHT}
      />

      <MessageFooter privateChat={sessionItem} sessionT={sessionT} />
    </div>
  );
};

export default PrivateChatSession;
