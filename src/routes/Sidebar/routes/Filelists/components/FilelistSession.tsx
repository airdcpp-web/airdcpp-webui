import { Component } from 'react';

import ListBrowser, {
  FilelistLocationState,
} from 'routes/Sidebar/routes/Filelists/components/ListBrowser';
import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { Location } from 'history';
import classNames from 'classnames';

type FilelistSessionProps = SessionChildProps<
  API.FilelistSession,
  UI.EmptyObject,
  UI.EmptyObject
>;

class FilelistSession extends Component<FilelistSessionProps> {
  static displayName = 'FilelistSession';

  render() {
    const { session, sessionT, location: routerLocation, history } = this.props;
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
          location={routerLocation as Location<FilelistLocationState>}
          session={session}
          sessionT={sessionT}
          history={history}
        />

        <FilelistFooter session={session} sessionT={sessionT} />
      </div>
    );
  }
}

export default ActiveSessionDecorator<FilelistSessionProps, API.FilelistSession>(
  FilelistSession
);
