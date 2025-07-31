import cx from 'classnames';

import IconConstants from '@/constants/IconConstants';
import Loader from '@/components/semantic/Loader';
import Message from '@/components/semantic/Message';

import { useActiveSession } from '@/effects/ActiveSessionEffect';
import FileFooter from '@/routes/Sidebar/routes/Files/components/FileFooter';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import FileContent from './FileContent';
import { SessionChildProps } from '@/routes/Sidebar/components/types';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import { ViewFileStoreSelector } from '@/stores/session/viewFileSlice';

export interface FileSessionProps
  extends SessionChildProps<API.ViewFile, UI.EmptyObject, UI.EmptyObject> {
  sessionT: UI.ModuleTranslator;
}

const FileSession: React.FC<FileSessionProps> = ({ sessionItem, sessionT }) => {
  useActiveSession(sessionItem, ViewFileAPIActions, ViewFileStoreSelector);
  const scrollPositionHandler = useSessionStoreProperty(
    (state) => state.viewFiles.scroll,
  );

  if (!sessionItem.content_ready) {
    if (sessionItem.download_state!.id === 'download_failed') {
      return (
        <div className="file session">
          <Message
            icon={IconConstants.ERROR}
            title={sessionT.translate('Download failed')}
            description={sessionItem.download_state!.str}
          />
        </div>
      );
    }

    return <Loader text={sessionItem.download_state!.str} />;
  }

  return (
    <div
      className={cx('file session', sessionItem.type.str, sessionItem.type.content_type)}
    >
      <FileContent
        file={sessionItem}
        sessionT={sessionT}
        scrollPositionHandler={scrollPositionHandler}
      />
      <FileFooter item={sessionItem} sessionT={sessionT} />
    </div>
  );
};

export default FileSession;
