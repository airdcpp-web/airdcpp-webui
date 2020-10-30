import { Component } from 'react';
import cx from 'classnames';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import FileFooter from 'routes/Sidebar/routes/Files/components/FileFooter';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import FileContent from './FileContent';
import ViewFileStore from 'stores/ViewFileStore';


export interface FileSessionProps extends SessionChildProps<API.ViewFile> {
  session: API.ViewFile;
  sessionT: UI.ModuleTranslator;
}

class FileSession extends Component<FileSessionProps> {
  render() {
    const { session, sessionT } = this.props;
    if (!session.content_ready) {
      if (session.download_state.id === 'download_failed') {
        return (
          <div className="file session">
            <Message 
              icon={ IconConstants.ERROR }
              title={ sessionT.translate('Download failed') }
              description={ session.download_state.str }
            />
          </div>
        );
      }

      return <Loader text={ session.download_state.str }/>;
    }

    return (
      <div className={ cx('file session', session.type.str, session.type.content_type) }>
        <FileContent
          session={ session }
          sessionT={ sessionT }
          scrollPositionHandler={ ViewFileStore.scroll }
        />
        <FileFooter 
          item={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default ActiveSessionDecorator(FileSession);
