import React from 'react';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistSessionStore from 'stores/FilelistSessionStore';
import FilelistSessionUIActions from 'actions/ui/FilelistSessionActions';
import FilelistSessionAPIActions from 'actions/reflux/FilelistSessionActions';

import FilelistNew from 'routes/Sidebar/routes/Filelists/components/FilelistNew';
import FilelistSession from 'routes/Sidebar/routes/Filelists/components/FilelistSession';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { 
  SessionProviderDecorator, SessionProviderDecoratorChildProps 
} from 'routes/Sidebar/decorators/SessionProviderDecorator';
import { toI18nKey } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';


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

const Filelists: React.FC<SessionProviderDecoratorChildProps<API.FilelistSession>> = props => {
  const { match, t, ...other } = props;
  return (
    <SessionLayout 
      activeId={ match.params.id }
      baseUrl="filelists"
      newCaption={ t(toI18nKey('new', UI.Modules.FILELISTS), 'Open filelist') }
      newDescription={ t(toI18nKey('newDesc', UI.Modules.FILELISTS), 'Start browsing a new filelist') } 
      newIcon={ IconConstants.FILELIST }
      disableSideMenu={ true }
      editAccess={ API.AccessEnum.FILELISTS_EDIT }
      uiActions={ FilelistSessionUIActions }
      sessionApi={ FilelistSessionAPIActions as UI.SessionActions<API.FilelistSession> }
      unreadInfoStore={ FilelistSessionStore }
      sessionItemLayout={ FilelistSession }
      newLayout={ FilelistNew }
      t={ t }
      { ...ItemHandler }
      { ...other }
    />
  );
};

export default SessionProviderDecorator(Filelists, FilelistSessionStore);
