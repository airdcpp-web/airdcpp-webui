import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import classNames from 'classnames';
import ListBrowser from './ListBrowser';
import { useNavigate } from 'react-router-dom';

type FilelistSessionProps = SessionChildProps<
  API.FilelistSession,
  UI.EmptyObject,
  UI.EmptyObject
>;

const FilelistSession: React.FC<FilelistSessionProps> = (props) => {
  const navigate = useNavigate();
  const { session, sessionT, location: routerLocation } = props;
  const { user, location: listLocation, state } = session;

  const isOwnList = user.flags.includes('self');
  const className = classNames('filelist session', { self: isOwnList });
  if (user.flags.includes('offline') && !isOwnList) {
    return (
      <div className={className}>
        <Message
          title={sessionT.t('userOffline', 'User offline')}
          description={sessionT.t<string>(
            'userOfflineDesc',
            'You will be able to continue browsing when the user comes back online'
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
      <ListBrowser
        location={routerLocation}
        session={session}
        sessionT={sessionT}
        navigate={navigate}
      />

      <FilelistFooter session={session} sessionT={sessionT} />
    </div>
  );
};

export default ActiveSessionDecorator<FilelistSessionProps, API.FilelistSession>(
  FilelistSession
);
