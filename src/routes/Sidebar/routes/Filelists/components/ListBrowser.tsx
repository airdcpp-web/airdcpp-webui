import * as React from 'react';
// import { Prompt, unstable_usePrompt } from 'react-router-dom';

import FilelistItemActions from 'actions/ui/FilelistItemActions';

import BrowserBar from 'components/browserbar/BrowserBar';
import { ActionMenu, DownloadMenu } from 'components/action-menu';

import NotificationActions from 'actions/NotificationActions';

import DownloadDialog from 'components/download/DownloadDialog';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { FilelistItemGetter } from './item-info-dialog';
import FilelistItemTable from './FilelistItemTable';
import {
  filelistDownloadHandler,
  changeFilelistDirectory,
} from 'services/api/FilelistApi';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import MenuConstants from 'constants/MenuConstants';
import { NavigateFunction, Location, unstable_useBlocker } from 'react-router-dom';

export type FilelistLocationState = { directory: string } | undefined;

interface ListBrowserProps {
  session: API.FilelistSession;
  location: Location;
  navigate: NavigateFunction;
  sessionT: UI.ModuleTranslator;
}

const ListBrowser: React.FC<ListBrowserProps> = ({
  location,
  sessionT,
  navigate,
  session,
}) => {
  // hasClickedDirectory = false;
  const [hasClickedDirectory, setHasClickedDirectory] = React.useState(false);

  unstable_useBlocker(({ currentLocation, nextLocation, historyAction }) => {
    if (
      historyAction === 'POP' &&
      hasClickedDirectory &&
      nextLocation.pathname !== location.pathname
    ) {
      setHasClickedDirectory(false);
      NotificationActions.info({
        title: sessionT.t('confirmLeave', 'Confirm action'),
        message: sessionT.t(
          'confirmLeaveDesc',
          'Click the back button again to leave this filelist'
        ),
      });
      return false;
    }

    return true;
  });

  /*routerWillLeave = (nextLocation: Location, action: string) => {
    if (
      action === 'POP' &&
      this.hasClickedDirectory &&
      nextLocation.pathname !== this.props.location.pathname
    ) {
      const { sessionT } = this.props;
      this.hasClickedDirectory = false;
      NotificationActions.info({
        title: sessionT.t('confirmLeave', 'Confirm action'),
        message: sessionT.t(
          'confirmLeaveDesc',
          'Click the back button again to leave this filelist'
        ),
      });
      return false;
    }

    return true;
  };*/

  const handleClickDirectory = (path: string) => {
    if (!hasClickedDirectory) {
      setHasClickedDirectory(true);
    }
    // this.hasClickedDirectory = true;
    // const { navigate, location } = this.props;

    // Handle it through location state data
    navigate(location.pathname, {
      state: {
        directory: path,
      },
    });
  };

  const sendChangeDirectory = (directory: string) => {
    runBackgroundSocketAction(
      () => changeFilelistDirectory(session, directory),
      sessionT.plainT
    );
  };

  React.useEffect(() => {
    // const { session, location, navigate } = this.props;

    const locationData = location.state as FilelistLocationState;
    if (!locationData || !locationData.directory) {
      // We need an initial path for our history
      navigate(location.pathname, {
        state: {
          directory: session.location!.path,
        } as FilelistLocationState,
      });
    }
  }, []);

  React.useEffect(() => {
    /*const oldLocationData = prevProps.location.state as FilelistLocationState;
    if (!!oldLocationData && oldLocationData.directory !== newLocationData.directory) {
      // It's our change
      sendChangeDirectory(newLocationData.directory);
    } else {*/

    // Change initiated by another session/GUI, update our location
    navigate(location.pathname, {
      state: {
        directory: session.location!.path,
        replace: true,
      },
    });
    // }
  }, [session.location?.path === (location.state as FilelistLocationState)?.directory]);

  React.useEffect(() => {
    const directory = (location.state as FilelistLocationState)?.directory;
    // It's our change
    if (directory) {
      sendChangeDirectory(directory);
    }
  }, [(location.state as FilelistLocationState)?.directory]);

  /*componentDidUpdate(prevProps: ListBrowserProps) {
    const newLocationData = this.props.location.state as FilelistLocationState;
    if (!newLocationData || !newLocationData.directory) {
      return;
    }

    if (this.props.session.location!.path === newLocationData.directory) {
      // Nothing has changed
      return;
    }

    const oldLocationData = prevProps.location.state as FilelistLocationState;
    if (!!oldLocationData && oldLocationData.directory !== newLocationData.directory) {
      // It's our change
      this.sendChangeDirectory(newLocationData.directory);
    } else {
      // Change initiated by another session/GUI, update our location
      this.props.navigate(this.props.location.pathname, {
        state: {
          directory: this.props.session.location!.path,
          replace: true,
        },
      });
    }
  }*/

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
        session={session}
        remoteMenuId={MenuConstants.FILELIST_ITEM}
        entityId={session.id}
      >
        <ActionMenu
          itemData={{
            item: session.location,
            session,
          }}
          actions={FilelistItemActions}
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
      {/*<Prompt message={routerWillLeave as any} />*/}

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
