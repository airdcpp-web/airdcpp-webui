import { Component } from 'react';

import ListBrowser, { FilelistLocationState } from 'routes/Sidebar/routes/Filelists/components/ListBrowser';
import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { Location } from 'history';


type FilelistSessionProps = SessionChildProps<API.FilelistSession, UI.EmptyObject, UI.EmptyObject>

class FilelistSession extends Component<FilelistSessionProps> {
  static displayName = 'FilelistSession';

  render() {
    const { session, sessionT } = this.props;
    const { user, location, state } = session;

    if (user.flags.indexOf('offline') !== -1 && user.flags.indexOf('self') === -1) {
      return (
        <div className="filelist session">
          <Message 
            title={ sessionT.t('userOffline', 'User offline') }
            description={ sessionT.t<string>(
              'userOfflineDesc', 
              'You will be able to continue browsing when the user comes back online'
            ) }
          />
        </div>
      );
    }

    if ((state.id !== 'loaded' && state.id !== 'download_failed') || !location) {
      return (
        <div className="filelist session">
          <Loader text={ state.str }/>
        </div>
      );
    }

    return (
      <div className="filelist session">
        <ListBrowser
          location={ this.props.location as Location<FilelistLocationState> }
          session={ session }
          sessionT={ sessionT }
        />

        <FilelistFooter
          session={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default ActiveSessionDecorator<FilelistSessionProps, API.FilelistSession>(FilelistSession);
