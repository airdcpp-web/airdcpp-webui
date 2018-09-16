import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import AccessConstants from 'constants/AccessConstants';

import FilelistNew from 'routes/Sidebar/routes/Filelists/components/FilelistNew';
import FilelistSession from 'routes/Sidebar/routes/Filelists/components/FilelistSession';

import '../style.css';


import { IconType } from 'components/semantic/Icon';
import { Location } from 'history';

import * as API from 'types/api';


interface SessionInfoGetter<SessionT> {
  itemLabelGetter: (session: SessionT) => React.ReactNode;
  itemNameGetter: (session: SessionT) => React.ReactNode;
  itemStatusGetter: (session: SessionT) => string;
  itemHeaderTitleGetter: (session: SessionT, location: Location, actionMenu: any) => React.ReactNode;
  itemHeaderDescriptionGetter: (session: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (session: SessionT) => IconType;
}


const UserItemHandler = UserItemHandlerDecorator([ 'message' ]);
const ItemHandler: SessionInfoGetter<API.FilelistSession> = {
  itemLabelGetter() {
    return null;
  },

  itemNameGetter(session) {
    return session.share_profile ? session.share_profile.str : UserItemHandler.itemNameGetter(session);
  },

  itemStatusGetter(session) {
    return session.share_profile ? 'blue' : UserItemHandler.itemStatusGetter(session);
  },

  itemHeaderTitleGetter(session, location, actionMenu) {
    return session.share_profile ? actionMenu : UserItemHandler.itemHeaderTitleGetter(session, location, actionMenu);
  },

  itemHeaderDescriptionGetter(session) {
    return session.share_profile ? null : UserItemHandler.itemHeaderDescriptionGetter(session);
  },

  itemHeaderIconGetter(session) {
    return session.share_profile ? 'green server' : UserItemHandler.itemHeaderIconGetter(session);
  },
};

const Filelists = createReactClass({
  displayName: 'Filelists',
  mixins: [ Reflux.connect(FilelistSessionStore, 'filelists') ],

  render() {
    const { children, match, ...other } = this.props;
    return (
      <SessionLayout 
        activeId={ match.params.id }
        baseUrl="filelists"
        items={ this.state.filelists }
        newCaption="Open filelist"
        newDescription="Start browsing a new filelist" 
        newIcon="browser" 
        disableSideMenu={ true }
        editAccess={ AccessConstants.FILELISTS_EDIT }
        actions={ FilelistSessionActions }
        unreadInfoStore={ FilelistSessionStore }
        sessionLayout={ FilelistSession }
        newLayout={ FilelistNew }

        { ...ItemHandler }
        { ...other }
      >
        { children }
      </SessionLayout>
    );
  },
});

export default Filelists;
