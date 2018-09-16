'use strict';
import React from 'react';

import ListBrowser from 'routes/Sidebar/routes/Filelists/components/ListBrowser';
import FilelistFooter from 'routes/Sidebar/routes/Filelists/components/FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';
import { Location } from 'history';


interface FilelistSessionProps {
  session: API.FilelistSession;
  location: Location;
}

class FilelistSession extends React.Component<FilelistSessionProps> {
  static displayName = 'FilelistSession';

  render() {
    const { user, location, state } = this.props.session;

    if (user.flags.indexOf('offline') !== -1 && user.flags.indexOf('self') === -1) {
      return (
        <Message 
          title="User offline"
          description="You will be able to continue browsing when the user comes back online"
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
          session={ this.props.session }
        />
      </div>
    );
  }
}

export default ActiveSessionDecorator(FilelistSession);
