import RecentLayout from '@/routes/Sidebar/components/RecentLayout';

import { HistoryEntryEnum } from '@/constants/HistoryConstants';

import * as API from '@/types/api';

import IconConstants from '@/constants/IconConstants';
import { UserSelectField } from '@/components/select';
import { NewSessionLayoutProps } from '@/routes/Sidebar/components/types';
import LinkButton from '@/components/semantic/LinkButton';
import { useSessionStore } from '@/context/SessionStoreContext';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { useSocket } from '@/context/SocketContext';
import { useTranslation } from 'react-i18next';

const MessageNew: React.FC<NewSessionLayoutProps> = (props) => {
  const sessionStore = useSessionStore();
  const socket = useSocket();
  const { t } = useTranslation();

  const hasSession = (entry: API.HistoryItem) => {
    return !!sessionStore.privateChats.getSession(entry.user!.cid);
  };

  const handleSubmit = (user: API.HintedUser) => {
    const { navigate } = props;
    PrivateChatAPIActions.createSession(user, {
      sessionStore,
      navigate,
      t,
      socket,
    });
  };

  const recentUserRender = (entry: API.HistoryItem) => {
    return (
      <LinkButton
        onClick={(_) => handleSubmit(entry.user!)}
        caption={entry.user!.nicks}
      />
    );
  };

  const { sessionT } = props;
  return (
    <div className="private chat session new">
      <UserSelectField
        onChange={handleSubmit}
        offlineMessage={sessionT.t(
          'offlineMessage',
          'You must to be connected to at least one hub in order to send private messages',
        )}
        isClearable={false}
        autoFocus={true}
      />
      <RecentLayout
        entryType={HistoryEntryEnum.PRIVATE_CHAT}
        hasSession={hasSession}
        entryTitleRenderer={recentUserRender}
        entryIcon={IconConstants.MESSAGES_PLAIN}
      />
    </div>
  );
};

export default MessageNew;
