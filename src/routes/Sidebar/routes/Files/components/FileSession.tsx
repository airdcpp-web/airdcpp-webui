import cx from 'classnames';

import IconConstants from 'constants/IconConstants';
import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

import { useActiveSession } from 'decorators/ActiveSessionDecorator';
import FileFooter from 'routes/Sidebar/routes/Files/components/FileFooter';

import * as API from 'types/api';
import * as UI from 'types/ui';

import FileContent from './FileContent';
import { SessionChildProps } from 'routes/Sidebar/components/types';
import { FilelistStoreSelector } from 'stores/filelistSlice';
import { FilelistAPIActions } from 'actions/store/FilelistActions';
import { useStoreProperty } from 'context/StoreContext';

export interface FileSessionProps
  extends SessionChildProps<API.ViewFile, UI.EmptyObject, UI.EmptyObject> {
  session: API.ViewFile;
  sessionT: UI.ModuleTranslator;
}

const FileSession: React.FC<FileSessionProps> = ({ session, sessionT }) => {
  useActiveSession(session, FilelistAPIActions, FilelistStoreSelector);
  const scrollPositionHandler = useStoreProperty((state) => state.filelists.scroll);

  if (!session.content_ready) {
    if (session.download_state!.id === 'download_failed') {
      return (
        <div className="file session">
          <Message
            icon={IconConstants.ERROR}
            title={sessionT.translate('Download failed')}
            description={session.download_state!.str}
          />
        </div>
      );
    }

    return <Loader text={session.download_state!.str} />;
  }

  return (
    <div className={cx('file session', session.type.str, session.type.content_type)}>
      <FileContent
        session={session}
        sessionT={sessionT}
        scrollPositionHandler={scrollPositionHandler}
      />
      <FileFooter item={session} sessionT={sessionT} />
    </div>
  );
};

export default FileSession;
