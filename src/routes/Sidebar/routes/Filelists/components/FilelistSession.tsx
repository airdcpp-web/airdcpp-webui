import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import classNames from 'classnames';
import ListBrowser from './ListBrowser';
import { SessionChildProps } from 'routes/Sidebar/components/types';
import { useActiveSession } from 'decorators/ActiveSessionDecorator';
import { FilelistAPIActions } from 'actions/store/FilelistActions';
import { FilelistStoreSelector } from 'stores/filelistSlice';

type FilelistSessionProps = SessionChildProps<
  API.FilelistSession,
  UI.EmptyObject,
  UI.EmptyObject
>;

const FilelistSession: React.FC<FilelistSessionProps> = ({
  session,
  sessionT,
  location: routerLocation,
}) => {
  useActiveSession(session, FilelistAPIActions, FilelistStoreSelector);

  const { user, location: listLocation, state } = session;

  const isOwnList = user.flags.includes('self');
  const className = classNames('filelist session', { self: isOwnList });
  if (user.flags.includes('offline') && !isOwnList) {
    return (
      <div className={className}>
        <Message
          title={sessionT.t('userOffline', 'User offline')}
          description={sessionT.t(
            'userOfflineDesc',
            'You will be able to continue browsing when the user comes back online',
          )}
        />
      </div>
    );
  }

  if ((state.id !== 'loaded' && state.id !== 'download_failed') || !listLocation) {
    return (
      <div className={className}>
        <Loader text={state.str} />
      </div>
    );
  }

  return (
    <div className={className}>
      <ListBrowser location={routerLocation} session={session} sessionT={sessionT} />

      <FilelistFooter session={session} sessionT={sessionT} />
    </div>
  );
};

export default FilelistSession;
