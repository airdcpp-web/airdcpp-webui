import * as React from 'react';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import ViewFileStore from 'stores/ViewFileStore';
import ViewFileAPIActions from 'actions/reflux/ViewFileActions';

import FileIcon from 'components/icon/FileIcon';
import Message from 'components/semantic/Message';

import FileSession from './FileSession';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';
import {
  SessionProviderDecoratorChildProps,
  SessionProviderDecorator,
} from 'routes/Sidebar/decorators/SessionProviderDecorator';
import { ViewFileActionMenu } from 'actions/ui/viewed-file';

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
        description={sessionT.t<string>(
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
      sessionApi={ViewFileAPIActions as UI.SessionActions<API.ViewFile>}
      unreadInfoStore={ViewFileStore}
      sessionItemLayout={FileSession}
      sessionT={sessionT}
      {...ItemHandler}
      {...other}
    />
  );
};

export default SessionProviderDecorator(Files, ViewFileStore, UI.Modules.VIEWED_FILES);
