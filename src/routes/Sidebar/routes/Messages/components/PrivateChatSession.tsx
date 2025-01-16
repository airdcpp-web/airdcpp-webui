import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/reflux/PrivateChatMessageStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { shareTempFile } from 'services/api/ShareApi';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import MenuConstants from 'constants/MenuConstants';
import { SessionChildProps } from 'routes/Sidebar/components/types';
import { useSession } from 'context/SessionContext';

type PrivateChatSessionProps = SessionChildProps<
  API.PrivateChat,
  UI.EmptyObject,
  UI.ChatActionList
>;

const PrivateChatSession: React.FC<PrivateChatSessionProps> = ({
  session,
  sessionApi,
  sessionT,
  uiActions,
}) => {
  const login = useSession();
  const handleFileUpload = (file: File) => {
    const { cid, hub_url, flags } = session.user;

    const isPrivate = !flags.includes('nmdc') && !flags.includes('bot');
    return shareTempFile(file, hub_url, isPrivate ? cid : undefined, login);
  };

  return (
    <div className="private chat session">
      <ChatLayout
        chatAccess={API.AccessEnum.PRIVATE_CHAT_SEND}
        chatActions={uiActions}
        chatApi={PrivateChatActions as UI.ChatAPI}
        sessionApi={sessionApi}
        messageStore={PrivateChatMessageStore}
        session={session}
        handleFileUpload={handleFileUpload}
        highlightRemoteMenuId={MenuConstants.PRIVATE_CHAT_MESSAGE_HIGHLIGHT}
      />

      <MessageFooter session={session} sessionT={sessionT} />
    </div>
  );
};

export default PrivateChatSession;
