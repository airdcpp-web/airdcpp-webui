import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistSessionActions from 'actions/FilelistSessionActions';

import FilelistNew from 'routes/Sidebar/routes/Filelists/components/FilelistNew';
import FilelistSession from 'routes/Sidebar/routes/Filelists/components/FilelistSession';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';


const UserItemHandler = UserItemHandlerDecorator([ 'message' ]);
const ItemHandler: UI.SessionInfoGetter<API.FilelistSession> = {
  itemLabelGetter() {
    return null;
  },

  itemNameGetter(session) {
    return session.share_profile ? session.share_profile.str : UserItemHandler.itemNameGetter(session);
  },

  itemStatusGetter(session) {
    return session.share_profile ? 'blue' : UserItemHandler.itemStatusGetter!(session);
  },

  itemHeaderTitleGetter(session, location, actionMenu) {
    return session.share_profile ? actionMenu : UserItemHandler.itemHeaderTitleGetter!(session, location, actionMenu);
  },

  itemHeaderDescriptionGetter(session) {
    return session.share_profile ? null : UserItemHandler.itemHeaderDescriptionGetter(session);
  },

  itemHeaderIconGetter(session) {
    return session.share_profile ? 'green server' : UserItemHandler.itemHeaderIconGetter(session);
  },
};

const Filelists = createReactClass<UI.SessionRouteProps, {}>({
  displayName: 'Filelists',
  mixins: [ Reflux.connect(FilelistSessionStore, 'filelists') ],

  render() {
    const { match, ...other }: UI.SessionRouteProps = this.props;
    return (
      <SessionLayout 
        activeId={ match.params.id }
        baseUrl="filelists"
        items={ this.state.filelists }
        newCaption="Open filelist"
        newDescription="Start browsing a new filelist" 
        newIcon="browser" 
        disableSideMenu={ true }
        editAccess={ API.AccessEnum.FILELISTS_EDIT }
        actions={ FilelistSessionActions }
        unreadInfoStore={ FilelistSessionStore }
        sessionItemLayout={ FilelistSession }
        newLayout={ FilelistNew }

        { ...ItemHandler }
        { ...other }
      />
    );
  },
});

export default Filelists;
