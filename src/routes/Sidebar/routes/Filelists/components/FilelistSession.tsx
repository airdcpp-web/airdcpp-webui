'use strict';
import React from 'react';

import ListBrowser from 'routes/Sidebar/routes/Filelists/components/ListBrowser';
import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';


interface FilelistSessionProps extends SessionChildProps<API.FilelistSession> {

}

class FilelistSession extends React.Component<FilelistSessionProps> {
  static displayName = 'FilelistSession';

  render() {
    const { session, sessionT } = this.props;
    const { user, location, state } = session;

    if (user.flags.indexOf('offline') !== -1 && user.flags.indexOf('self') === -1) {
      return (
        <Message 
          title={ sessionT.t('userOffline', 'User offline') }
          description={ sessionT.t<string>(
            'userOfflineDesc', 
            'You will be able to continue browsing when the user comes back online'
          ) }
        />
      );
    }

    if ((state.id !== 'loaded' && state.id !== 'download_failed') || !location) {
      return <Loader text={ state.str }/>;
    }

    return (
      <div className="filelist session">
        <ListBrowser
          { ...this.props }
        />

        <FilelistFooter
          session={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default ActiveSessionDecorator(FilelistSession);
