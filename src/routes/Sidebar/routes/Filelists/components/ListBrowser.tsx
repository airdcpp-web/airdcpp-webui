import * as React from 'react';

import BrowserBar from '@/components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from '@/components/action-menu';

import DownloadDialog from '@/components/download/DownloadDialog';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { FilelistItemGetter } from './item-info-dialog';
import FilelistItemTable from './FilelistItemTable';
import { filelistDownloadHandler } from '@/services/api/FilelistApi';
import MenuConstants from '@/constants/MenuConstants';
import { Location, useBlocker } from 'react-router';
import { useSyncFilelistLocation } from '../effects/useSyncFilelistLocation';
import NotificationActions from '@/actions/NotificationActions';
import { FilelistItemActionMenu } from '@/actions/ui/filelist';

interface ListBrowserProps {
  session: API.FilelistSession;
  location: Location;
  sessionT: UI.ModuleTranslator;
}

const ListBrowser: React.FC<ListBrowserProps> = (props) => {
  const { sessionT, session } = props;
  const [hasClickedDirectory, setHasClickedDirectory] = React.useState(false);

  const updateLocationState = useSyncFilelistLocation(props);

  const handleClickDirectory = (path: string) => {
    if (!hasClickedDirectory) {
      setHasClickedDirectory(true);
    }

    updateLocationState(path, false);
  };

  useBlocker(({ currentLocation, nextLocation, historyAction }) => {
    if (
      historyAction === 'POP' &&
      hasClickedDirectory &&
      nextLocation.pathname !== currentLocation.pathname
    ) {
      setHasClickedDirectory(false);
      NotificationActions.info({
        title: sessionT.t('confirmLeave', 'Confirm action'),
        message: sessionT.t(
          'confirmLeaveDesc',
          'Click the back button again to leave this filelist',
        ),
      });
      return true;
    }

    return false;
  });

  const getCurrentDirectory = () => {
    return session.location;
  };

  const selectedNameFormatter = (caption: React.ReactNode) => {
    return (
      <DownloadMenu
        caption={caption}
        user={session.user}
        itemInfoGetter={getCurrentDirectory}
        downloadHandler={filelistDownloadHandler}
        contextElement=".session-container"
        entity={session}
        remoteMenuId={MenuConstants.FILELIST_ITEM}
      >
        <ActionMenu
          itemData={session.location}
          actions={FilelistItemActionMenu}
          entity={session}
        />
      </DownloadMenu>
    );
  };

  const userGetter = () => {
    return session.user;
  };

  const filelistItemFetcher = FilelistItemGetter(session);

  return (
    <div className="browser">
      <BrowserBar
        path={session.location!.path}
        separator="/"
        rootPath="/"
        rootName={sessionT.translate('Root')}
        itemClickHandler={handleClickDirectory}
        selectedNameFormatter={selectedNameFormatter}
        // Just to make sure that the bar gets re-rendered when the switching to a different session (due to dropdown)
        entityId={session.id}
      />
      <FilelistItemTable
        session={session}
        sessionT={sessionT}
        onClickDirectory={handleClickDirectory}
      />
      <DownloadDialog
        downloadHandler={filelistDownloadHandler}
        itemDataGetter={filelistItemFetcher}
        userGetter={userGetter}
        session={session}
      />
    </div>
  );
};

export default ListBrowser;
