import * as React from 'react';

import SessionLayout from '@/routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from '@/routes/Sidebar/decorators/UserItemHandlerDecorator';

import FilelistNew from '@/routes/Sidebar/routes/Filelists/components/FilelistNew';
import FilelistSession from '@/routes/Sidebar/routes/Filelists/components/FilelistSession';

import '../style.css';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import {
  SessionProviderDecorator,
  SessionProviderDecoratorChildProps,
} from '@/routes/Sidebar/decorators/SessionProviderDecorator';
import IconConstants from '@/constants/IconConstants';
import { FilelistSessionActionMenu } from '@/actions/ui/filelist';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { FilelistStoreSelector } from '@/stores/session/filelistSlice';
import MenuConstants from '@/constants/MenuConstants';

const UserItemHandler = UserItemHandlerDecorator(['message']);
const ItemHandler: UI.SessionInfoGetter<API.FilelistSession> = {
  itemLabelGetter() {
    return null;
  },

  itemNameGetter(session) {
    return session.share_profile
      ? session.share_profile.str
      : UserItemHandler.itemNameGetter(session);
  },

  itemStatusGetter(session) {
    return session.share_profile ? 'blue' : UserItemHandler.itemStatusGetter!(session);
  },

  itemHeaderTitleGetter(session, location, actionMenu) {
    return session.share_profile
      ? actionMenu
      : UserItemHandler.itemHeaderTitleGetter!(session, location, actionMenu);
  },

  itemHeaderDescriptionGetter(session) {
    return session.share_profile
      ? null
      : UserItemHandler.itemHeaderDescriptionGetter(session);
  },

  itemHeaderIconGetter(session) {
    return session.share_profile
      ? 'green server'
      : UserItemHandler.itemHeaderIconGetter(session);
  },
};

const Filelists: React.FC<SessionProviderDecoratorChildProps<API.FilelistSession>> = (
  props,
) => {
  const { params, sessionT, ...other } = props;
  return (
    <SessionLayout
      activeId={params.id}
      baseUrl="filelists"
      newCaption={sessionT.t('new', 'Open filelist')}
      newDescription={sessionT.t('newDesc', 'Start browsing a new filelist')}
      newIcon={IconConstants.FILELISTS_PLAIN}
      disableSideMenu={true}
      editAccess={API.AccessEnum.FILELISTS_EDIT}
      uiActions={FilelistSessionActionMenu}
      sessionApi={FilelistAPIActions}
      sessionStoreSelector={FilelistStoreSelector}
      sessionItemLayout={FilelistSession}
      newLayout={FilelistNew}
      sessionT={sessionT}
      remoteMenuId={MenuConstants.FILELIST}
      {...ItemHandler}
      {...other}
    />
  );
};

export default SessionProviderDecorator(
  Filelists,
  FilelistStoreSelector,
  UI.Modules.FILELISTS,
);
