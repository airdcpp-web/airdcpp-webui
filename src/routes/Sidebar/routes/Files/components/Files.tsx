import * as React from 'react';

import SessionLayout from '@/routes/Sidebar/components/SessionLayout';

import FileIcon from '@/components/icon/FileIcon';
import Message from '@/components/semantic/Message';

import FileSession from './FileSession';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import {
  SessionProviderDecoratorChildProps,
  SessionProviderDecorator,
} from '@/routes/Sidebar/decorators/SessionProviderDecorator';
import { ViewFileActionMenu } from '@/actions/ui/viewed-file';

import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import { ViewFileStoreSelector } from '@/stores/session/viewFileSlice';

import '../style.css';
import MenuConstants from '@/constants/MenuConstants';

const ItemHandler: UI.SessionInfoGetter<API.ViewFile> = {
  itemNameGetter(session) {
    return session.name;
  },

  itemLabelGetter() {
    return null;
  },

  itemHeaderDescriptionGetter() {
    return null;
  },

  itemHeaderIconGetter(session) {
    return <FileIcon typeInfo={session.type} />;
  },
};

const Files: React.FC<SessionProviderDecoratorChildProps<API.ViewFile>> = (props) => {
  const { params, sessionT, ...other } = props;
  if (props.items.length === 0) {
    return (
      <Message
        title={sessionT.t('noFiles', 'No files to view')}
        description={sessionT.t(
          'noFilesDesc',
          'You may open text or media files to be viewed here from search or filelists',
        )}
      />
    );
  }

  return (
    <SessionLayout
      activeId={params.id}
      baseUrl="files"
      disableSideMenu={true}
      editAccess={API.AccessEnum.VIEW_FILE_EDIT}
      uiActions={ViewFileActionMenu}
      sessionApi={ViewFileAPIActions}
      sessionStoreSelector={ViewFileStoreSelector}
      sessionItemLayout={FileSession}
      sessionT={sessionT}
      remoteMenuId={MenuConstants.VIEW_FILE}
      {...ItemHandler}
      {...other}
    />
  );
};

export default SessionProviderDecorator(
  Files,
  ViewFileStoreSelector,
  UI.Modules.VIEWED_FILES,
);
