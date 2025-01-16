import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/reflux/FilelistSessionStore';

import ShareProfileSelector from 'routes/Sidebar/routes/Filelists/components/ShareProfileSelector';
import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import IconConstants from 'constants/IconConstants';
import { UserSelectField } from 'components/select';
import { NewSessionLayoutProps } from 'routes/Sidebar/components/types';
import LinkButton from 'components/semantic/LinkButton';

const FilelistNew: React.FC<NewSessionLayoutProps> = (props) => {
  const handleSubmit = (user: API.HintedUser) => {
    const { navigate, location } = props;
    FilelistSessionActions.createSession(
      { user },
      {
        navigate,
        location,
        sessionStore: FilelistSessionStore,
      },
    );
  };

  const onProfileChanged = (profileId: number) => {
    const { navigate, location } = props;
    FilelistSessionActions.ownList(profileId, {
      navigate,
      location,
      sessionStore: FilelistSessionStore,
    });
  };

  const recentUserRender = (entry: API.HistoryItem) => {
    const caption =
      entry.user!.nicks + (entry.description ? ` (${entry.description})` : '');
    return <LinkButton onClick={(_) => handleSubmit(entry.user!)} caption={caption} />;
  };

  const hasSession = (entry: API.HistoryItem) => {
    return FilelistSessionStore.getSession(entry.user!.cid);
  };

  const { sessionT } = props;
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
