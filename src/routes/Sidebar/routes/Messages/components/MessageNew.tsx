import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import PrivateChatSessionStore from 'stores/reflux/PrivateChatSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import IconConstants from 'constants/IconConstants';
import { UserSelectField } from 'components/select';
import { NewSessionLayoutProps } from 'routes/Sidebar/components/types';
import LinkButton from 'components/semantic/LinkButton';

const hasSession = (entry: API.HistoryItem) => {
  return PrivateChatSessionStore.getSession(entry.user!.cid);
};

const MessageNew: React.FC<NewSessionLayoutProps> = (props) => {
  const handleSubmit = (user: API.HintedUser) => {
    const { location, navigate } = props;
    PrivateChatActions.createSession(user, {
      sessionStore: PrivateChatSessionStore,
      location,
      navigate,
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
