import React from 'react';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import ViewFileStore from 'stores/ViewFileStore';
import ViewFileActions from 'actions/ViewFileActions';

import FileIcon from 'components/icon/FileIcon';
import Message from 'components/semantic/Message';

import FileSession from './FileSession';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { 
  SessionProviderDecoratorChildProps, SessionProviderDecorator 
} from 'routes/Sidebar/decorators/SessionProviderDecorator';


const ItemHandler: UI.SessionInfoGetter<API.ViewFile> = {
  itemNameGetter(session) {
    return session.name;
  },

  itemLabelGetter(session) {
    return null;
  },

  itemHeaderDescriptionGetter(session) {
    return null;
  },

  itemHeaderIconGetter(session) {
    return <FileIcon typeInfo={ session.type }/>;
  },
};


const Files: React.FC<SessionProviderDecoratorChildProps<API.FileType>> = props => {
  if (props.items.length === 0) {
    return (
      <Message
        title="No files to view"
        description="You may open text or image files to be viewed here (from search or filelists)"
      />
    );
  }

  const { match, ...other } = props;
  return (
    <SessionLayout
      activeId={ match.params.id }
      baseUrl="files"
      disableSideMenu={ true }
      editAccess={ API.AccessEnum.VIEW_FILE_EDIT }
      actions={ ViewFileActions }
      unreadInfoStore={ ViewFileStore }
      sessionItemLayout={ FileSession }
      { ...ItemHandler }
      { ...other }
    />
  );
};

export default SessionProviderDecorator(Files, ViewFileStore);
