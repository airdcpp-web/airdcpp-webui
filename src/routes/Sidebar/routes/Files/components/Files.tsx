import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';

import ViewFileStore from 'stores/ViewFileStore';
import ViewFileActions from 'actions/ViewFileActions';

import FileIcon from 'components/icon/FileIcon';
import Message from 'components/semantic/Message';

import FileSession from './FileSession';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';


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


const Files = createReactClass<UI.SessionRouteProps, {}>({
  displayName: 'Files',
  mixins: [ Reflux.connect(ViewFileStore, 'files') ],

  render() {
    const { files } = this.state;
    if (files.length === 0) {
      return (
        <Message
          title="No files to view"
          description="You may open text or image files to be viewed here (from search or filelists)"
        />
      );
    }

    const { match, location }: UI.SessionRouteProps = this.props;
    return (
      <SessionLayout
        activeId={ match.params.id }
        baseUrl="files"
        items={ files }
        disableSideMenu={ true }
        editAccess={ API.AccessEnum.VIEW_FILE_EDIT }
        actions={ ViewFileActions }
        unreadInfoStore={ ViewFileStore }
        sessionItemLayout={ FileSession }
        location={ location }
        { ...ItemHandler }
        //{ ...other }
      />
    );
  },
});

export default Files;
