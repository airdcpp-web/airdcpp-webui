'use strict';
import React from 'react';
import cx from 'classnames';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';

import AudioFile from 'routes/Sidebar/routes/Files/components/AudioFile';
import ImageFile from 'routes/Sidebar/routes/Files/components/ImageFile';
import TextFile from 'routes/Sidebar/routes/Files/components/TextFile';
import VideoFile from 'routes/Sidebar/routes/Files/components/VideoFile';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import FileFooter from 'routes/Sidebar/routes/Files/components/FileFooter';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';


export interface FileSessionProps extends SessionChildProps<API.ViewFile> {
  session: API.ViewFile;
  sessionT: UI.ModuleTranslator;
}

export interface FileSessionContentProps {
  item: API.ViewFile;
  url: string;
  type: string;
  extension: string;
  sessionT: UI.ModuleTranslator;
}

const getViewerElement = (item: API.ViewFile): React.ComponentType<FileSessionContentProps> | null => {
  if (item.text) {
    return TextFile;
  }

  switch (item.type.content_type) {
    case 'audio': return AudioFile;
    case 'picture': return ImageFile;
    case 'video': return VideoFile;
    default:
  }

  return null;
};

const getUrl = (tth: string) => {
  return `${getBasePath()}view/${tth}?auth_token=${LoginStore.authToken}`; 
};

class FileSession extends React.Component<FileSessionProps> {
  render() {
    const { session, sessionT } = this.props;
    if (!session.content_ready) {
      if (session.download_state.id === 'download_failed') {
        return (
          <Message 
            icon={ IconConstants.ERROR }
            title={ sessionT.translate('Download failed') }
            description={ session.download_state.str }
          />
        );
      }

      return <Loader text={ session.download_state.str }/>;
    }

    const ViewerElement = getViewerElement(session);

    let child;
    if (!ViewerElement) {
      child = sessionT.translate('Unsupported format');
    } else {
      child = (
        <ViewerElement 
          item={ session }
          url={ getUrl(session.tth) }
          type={ session.mime_type }
          extension={ session.type.str }
          sessionT={ sessionT }
        />
      );
    }

    return (
      <div className={ cx('file session', session.type.str, session.type.content_type) }>
        <div className="content">
          { child }
        </div>
        <FileFooter 
          item={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default ActiveSessionDecorator(FileSession);
