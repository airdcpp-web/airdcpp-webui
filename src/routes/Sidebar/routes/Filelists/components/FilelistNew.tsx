import RecentLayout from '@/routes/Sidebar/components/RecentLayout';

import ShareProfileSelector from '@/routes/Sidebar/routes/Filelists/components/ShareProfileSelector';
import { HistoryEntryEnum } from '@/constants/HistoryConstants';

import * as API from '@/types/api';

import IconConstants from '@/constants/IconConstants';
import { UserSelectField } from '@/components/select';
import { NewSessionLayoutProps } from '@/routes/Sidebar/components/types';
import LinkButton from '@/components/semantic/LinkButton';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { useSessionStore } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';

const FilelistNew: React.FC<NewSessionLayoutProps> = ({ navigate, sessionT }) => {
  const sessionStore = useSessionStore();
  const socket = useSocket();

  const createSessionProps = {
    sessionStore,
    socket,
    navigate,
    t: sessionT.plainT,
  };

  const handleSubmit = (user: API.HintedUser) => {
    FilelistAPIActions.createRemoteSession({ user }, createSessionProps);
  };

  const onProfileChanged = (shareProfileId: number) => {
    FilelistAPIActions.createLocalSession({ shareProfileId }, createSessionProps);
  };

  const recentUserRender = (entry: API.HistoryItem) => {
    const caption =
      entry.user!.nicks + (entry.description ? ` (${entry.description})` : '');
    return <LinkButton onClick={(_) => handleSubmit(entry.user!)} caption={caption} />;
  };

  const hasSession = (entry: API.HistoryItem) => {
    return !!sessionStore.filelists.getSession(entry.user!.cid);
  };

  return (
    <div className="filelist session new">
      <UserSelectField
        onChange={handleSubmit}
        offlineMessage={sessionT.t(
          'offlineMessage',
          'You must to be connected to at least one hub in order to download filelists from other users',
        )}
        isClearable={false}
        autoFocus={true}
      />
      <ShareProfileSelector onProfileChanged={onProfileChanged} sessionT={sessionT} />
      <RecentLayout
        entryType={HistoryEntryEnum.FILELIST}
        hasSession={hasSession}
        entryTitleRenderer={recentUserRender}
        entryIcon={IconConstants.FILELISTS_PLAIN}
      />
    </div>
  );
};

export default FilelistNew;
